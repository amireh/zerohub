const React = require('react');
const CodeMirror = require('CodeMirror');
const { Button, Icon, Link } = require('components');
const WarningMessage = require('components/WarningMessage');
const OutletOccupant = require('components/OutletOccupant');
const PageDrawer = require('./PageDrawer');
const ErrorCodes = require('ErrorCodes');
const LoadingIndicator = require('./LoadingIndicator');
const ErrorMessage = require('components/ErrorMessage');
const EditableText = require('components/EditableText');
const AutosizingInput = require('components/AutosizingInput');
const debounce = require('utils/debounce');
const unescapeHTML = require('utils/unescapeHTML');
const { partial } = require('lodash');

const { PropTypes } = React;
const Page = React.createClass({
  propTypes: {
    page: PropTypes.shape({
      id: PropTypes.string,
      content: PropTypes.string,
      encrypted: PropTypes.bool,
      folder_id: PropTypes.string,
      title: PropTypes.string,
    }),

    pageTitle: PropTypes.string,
    passPhrase: PropTypes.string,

    space: PropTypes.shape({
      id: PropTypes.string,
    }),

    query: PropTypes.shape({
      drawer: PropTypes.oneOf([ '1', null ]),
    }).isRequired,

    onUpdateContent: PropTypes.func.isRequired,
    onUpdateQuery: PropTypes.func.isRequired,
    onUpdatePageEncryptionStatus: PropTypes.func.isRequired,
    onUpdateTitle: PropTypes.func.isRequired,
    onReacquireLock: PropTypes.func,

    saving: PropTypes.bool,
    isDecrypting: PropTypes.bool,
    isRetrievingPassPhrase: PropTypes.bool,

    hasSavingError: PropTypes.bool,
    hasDecryptionError: PropTypes.bool,

    loadError: PropTypes.oneOf([
      ErrorCodes.MISSING_PASS_PHRASE_ERROR,
      ErrorCodes.PAGE_CIPHER_ERROR,
      ErrorCodes.PAGE_DIGEST_MISMATCH_ERROR,
      ErrorCodes.PAGE_FETCH_ERROR,
    ]),
  },

  componentWillMount() {
    this.emitChangeOfContent = debounce(this._emitChangeOfContent, 1000, (args) => {
      return JSON.stringify([ args.folderId, args.pageId ]);
    });
  },

  componentWillUnmount() {
    this.removeEditorIfNeeded();
  },

  render() {
    const { page } = this.props;
    const pageTitle = page && page.title || this.props.pageTitle || I18n.t('Untitled Page');

    return (
      <div className="space-page">
        <div className="space-page__header">
          <h1 className="space-page__title">
            <EditableText
              wrapper={component => <AutosizingInput>{component}</AutosizingInput>}
              value={unescapeHTML(pageTitle || I18n.t('Untitled Page'))}
              onChange={this.props.onUpdateTitle}
            />

            {page && page.encrypted && (
              <Icon
                sizeHint="display"
                className="icon-lock_outline"
                style={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  margin: '-0.25rem 0 0 0.25rem'
                }}
              />
            )}

            {this.props.saving && (
              <span> <em>{I18n.t('Saving...')}</em></span>
            )}
          </h1>

          {page && (
            <div className="space-page__header-actions">
              <Button
                hint="icon"
                onClick={partial(this.props.onRemovePage, { pageId: page.id })}
                className="padding-rl-m"
                title={I18n.t('Send this page to the abyss')}
              >
                <Icon
                  sizeHint="display"
                  className="icon-delete"
                  styleHint="secondary"
                />
              </Button>

              <Button hint="icon" onClick={this.toggleDrawer} className="padding-r-0">
                <Icon sizeHint="display" className="icon-more_vert" />
              </Button>
            </div>
          )}
        </div>

        <div className="space-page__content">
          {this.renderBody()}
        </div>

        {this.props.page && !this.props.canEdit && !this.props.acquiringLock && (
          <OutletOccupant name="MEMBER_STICKY_NOTICE">
            <p>
              {I18n.t('Sorry! Someone else seems to be editing this page so you may only read it.')}
              {' '}
              <Button
                onClick={this.props.onReacquireLock}
                hint="link"
              >
                {I18n.t('Attempt to acquire the lock?')}
              </Button>
            </p>
          </OutletOccupant>
        )}
        {this.props.page && this.props.query.drawer === '1' && (
          <OutletOccupant name="MEMBER_DRAWER" page={this.props.page}>
            <PageDrawer
              space={this.props.space}
              page={this.props.page}
              location={this.props.location}
              passPhrase={this.props.passPhrase}
              isRetrievingPassPhrase={this.props.isRetrievingPassPhrase}
              onChangeOfEncryptionStatus={this.props.onUpdatePageEncryptionStatus}
            />
          </OutletOccupant>
        )}
      </div>
    );
  },

  renderBody() {
    if (this.props.loadError) {
      return (
        <ErrorMessage>
          {this.renderLoadError(this.props.loadError)}
        </ErrorMessage>
      )
    }
    else if (this.props.loading || !this.props.page) {
      return (
        <LoadingIndicator />
      )
    }

    return (
      <div>
        {this.props.saveError && (
          <WarningMessage>
            {I18n.t(
              'Oops! Something went wrong while saving the page. You ' +
              'may want to try again later.'
            )}
          </WarningMessage>
        )}
        {this.props.hasDecryptionError && (
          <WarningMessage>
            Page content is marked as encrypted but failed to be decrypted using
            the pass-phrase assigned to this space. This could either mean that
            the page encrypted using a different pass-phrase, or that there is
            an internal error.
          </WarningMessage>
        )}

        <textarea ref={this.createEditor} readOnly value={this.props.page.content} />
      </div>
    )
  },

  renderLoadError(error) {
    switch (error) {
      case ErrorCodes.PAGE_FETCH_ERROR:
        return <p>{I18n.t('Sorry! We were unable to load the page.')}</p>
      break;

      case ErrorCodes.PAGE_CIPHER_ERROR:
        return <p>{I18n.t(
          `Dang! It seems this page was encrypted using a different pass-phrase ` +
          `than the one you've supplied.`
        )}</p>
      break;

      case ErrorCodes.PAGE_DIGEST_MISMATCH_ERROR:
        return <p>{I18n.t(
          `Whoop! We've encountered a likely internal error while decrypting ` +
          `this page's contents.`
        )}</p>
      break;

      case ErrorCodes.MISSING_PASS_PHRASE_ERROR:
        return <p>{I18n.t(
          `Sorry! This page is encrypted but you have not supplied any ` +
          `pass-phrase to decrypt it with.`
        )}</p>
      break;
    }
  },

  createEditor(node) {
    const RULER = 80;

    this.removeEditorIfNeeded();

    if (!node) {
      return;
    }

    this.editor = CodeMirror.fromTextArea(node, {
      mode: "gfm",
      lineNumbers: false,
      matchBrackets: true,
      theme: "default",
      tabSize: 2,
      indentUnit: 2,
      gutter: false,
      lineNumbers: false,
      foldGutter: true,
      gutters: [ "CodeMirror-foldgutter" ],
      autoClearEmptyLines: false,
      lineWrapping: true,
      styleActiveLine: true,
      rulers: [ RULER ],
      keyMap: "sublime",
      viewportMargin: Infinity,
    })

    // this.editor.setValue(this.props.page.content);
    this.editor.on('changes', this.emitChangeOfContent);
  },

  removeEditorIfNeeded() {
    if (this.editor) {
      this.editor.off('changes', this.emitChangeOfContent);
      this.editor.toTextArea();
      this.editor = null;
    }
  },

  _emitChangeOfContent(instance/*, changes*/) {
    this.props.onUpdateContent(instance.doc.getValue());
  },

  toggleDrawer() {
    this.props.onUpdateQuery({
      drawer: this.props.query.drawer === '1' ? null : '1'
    })
  },
});

module.exports = Page;
