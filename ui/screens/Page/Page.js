import React, { PropTypes } from 'react';
import CodeMirror from 'CodeMirror';
import { ActionEmitter } from 'cornflux';
import { Button } from 'components/Native';
import Icon from 'components/Icon';
import WarningMessage from 'components/WarningMessage';
import OutletOccupant from 'components/OutletOccupant';
import PageDrawer from './PageDrawer';
import * as ErrorCodes from './ErrorCodes';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from 'components/ErrorMessage';
import debounce from 'utils/debounce';

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

    dispatch: PropTypes.func.isRequired,

    space: PropTypes.shape({
      id: PropTypes.string,
    }),

    query: PropTypes.shape({
      drawer: PropTypes.oneOf([ '1', null ]),
    }).isRequired,

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
    const pageTitle = this.props.page && this.props.page.title || this.props.pageTitle || I18n.t('Untitled Page');

    return (
      <div className="space-page">
        <div className="space-page__header">
          <h1 className="space-page__title">
            {pageTitle}

            {this.props.page && this.props.page.encrypted && (
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

          <div className="space-page__header-actions">
            <Button hint="icon" onClick={this.toggleDrawer}>
              <Icon sizeHint="display" className="icon-more_vert" />
            </Button>
          </div>
        </div>

        <div className="space-page__content">
          {this.renderBody()}

        </div>

        {this.props.page && this.props.query.drawer === '1' && (
          <OutletOccupant name="SPACE_DRAWER">
            <PageDrawer
              space={this.props.space}
              page={this.props.page}
              passPhrase={this.props.passPhrase}
              isRetrievingPassPhrase={this.props.isRetrievingPassPhrase}
              onChangeOfEncryptionStatus={this.emitChangeOfEncryptionStatus}
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
    console.debug('updating page content...');

    this.props.dispatch('UPDATE_PAGE_CONTENT', {
      pageId: this.props.page.id,
      encrypted: this.props.page.encrypted,
      passPhrase: this.props.passPhrase,
      content: instance.doc.getValue()
    })
  },

  toggleDrawer() {
    this.props.dispatch('UPDATE_QUERY', {
      drawer: this.props.query.drawer === '1' ? null : '1'
    })
  },

  emitChangeOfEncryptionStatus(status) {
    this.props.dispatch('SET_PAGE_ENCRYPTION_STATUS', {
      page: this.props.page,
      passPhrase: this.props.passPhrase,
      encrypted: status
    });
  },
});

export default ActionEmitter(Page, {
  actions: [
    'UPDATE_PAGE_CONTENT',
    'UPDATE_QUERY',
    'SET_PAGE_ENCRYPTION_STATUS'
  ]
});
