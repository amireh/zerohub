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

const Page = React.createClass({
  propTypes: {
    page: PropTypes.shape({
      id: PropTypes.string,
      content: PropTypes.string,
      encrypted: PropTypes.bool,
      folder_id: PropTypes.string,
      title: PropTypes.string,
    }),

    decryptedContent: PropTypes.string,
    decryptedDigest: PropTypes.string,
    passPhrase: PropTypes.object,

    dispatch: PropTypes.func.isRequired,

    space: PropTypes.shape({
      id: PropTypes.string,
    }),

    query: PropTypes.shape({
      drawer: PropTypes.oneOf([ '1', null ]),
      'page-settings': PropTypes.oneOf([ '1', null ]),
    }).isRequired,

    isSaving: PropTypes.bool,
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

  componentDidMount() {
    // if (this.props.page.encrypted) {
    //   this.props.dispatch('RETRIEVE_PASS_PHRASE', { spaceId: this.props.space.id });
    // }
  },

  componentWillReceiveProps(nextProps) {
    // if (nextProps.page.id !== this.props.page.id && !nextProps.page.encrypted) {
    //   this.editor.off('changes', this.emitChangeOfContent);
    //   this.editor.setValue(nextProps.page.content);
    //   this.editor.clearHistory();
    //   this.editor.on('changes', this.emitChangeOfContent);
    // }
    // else if (nextProps.page.id !== this.props.page.id && nextProps.page.encrypted && nextProps.decryptedContent) {
    //   this.editor.off('changes', this.emitChangeOfContent);
    //   this.editor.setValue(nextProps.decryptedContent);
    //   this.editor.clearHistory();
    //   this.editor.on('changes', this.emitChangeOfContent);
    // }
    // else if (nextProps.page.encrypted && !nextProps.decryptedContent) {
    //   this.editor.off('changes', this.emitChangeOfContent);
    //   this.editor.setValue('');
    //   this.editor.clearHistory();
    // }
    // else if (nextProps.page.encrypted && !this.props.decryptedContent && nextProps.decryptedContent) {
    //   this.editor.off('changes', this.emitChangeOfContent);
    //   this.editor.setValue(nextProps.decryptedContent);
    //   this.editor.clearHistory();
    //   this.editor.on('changes', this.emitChangeOfContent);
    // }

    // if (
    //   nextProps.page.encrypted &&
    //   !nextProps.passPhrase &&
    //   !nextProps.isRetrievingPassPhrase
    // ) {
    //   this.props.dispatch('RETRIEVE_PASS_PHRASE', {
    //     spaceId: this.props.space.id
    //   });
    // }

    // if (
    //   nextProps.page.encrypted &&
    //   nextProps.passPhrase &&
    //   !nextProps.decryptedContent &&
    //   !nextProps.isDecrypting &&
    //   !nextProps.hasDecryptionError
    // ) {
    //   this.props.dispatch('DECRYPT_PAGE', {
    //     pageId: nextProps.page.id,
    //     passPhrase: nextProps.passPhrase,
    //     content: nextProps.page.content,
    //   })
    // }
  },

  componentWillUnmount() {
    if (this.editor) {
      this.editor.off('changes', this.emitChangeOfContent);
      this.editor.toTextArea();
      this.editor = null;
    }
  },

  render() {
    if (this.props.loading) {
      return (
        <LoadingIndicator />
      )
    }
    else if (this.props.loadError) {
      return (
        <ErrorMessage>
          {this.renderLoadError(this.props.loadError)}
        </ErrorMessage>
      )
    }
    else if (!this.props.page) {
      return null;
    }

    return (
      <div className="space-page">
        <div className="space-page__header">
          <h1 className="space-page__title">
            {this.props.page.title}
            {this.props.isSaving && (
              <span> <em>Saving...</em></span>
            )}
          </h1>

          <div className="space-page__header-actions">
            <Button hint="icon" onClick={this.toggleDrawer}>
              <Icon sizeHint="display" className="icon-more_vert" />
            </Button>

            {false && (
              <div className="inline-block">
                <Button onClick={this.toggleSettingsMenu} hint="icon">
                  <Icon className="icon-settings" />
                </Button>

                {this.props.query['page-settings'] === '1' && (
                  this.renderSettingsMenu()
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-page__content">
          {this.props.hasDecryptionError && (
            <WarningMessage>
              Page content is marked as encrypted but failed to be decrypted using
              the pass-phrase assigned to this space. This could either mean that
              the page encrypted using a different pass-phrase, or that there is
              an internal error.
            </WarningMessage>
          )}

          {this.requiresContentEncryption() && (
            <WarningMessage>
              This page is stored in plain-text format although you have requested
              it to be encrypted. <Button hint="link" onClick={this.encryptPage}>Click here</Button>
              {' '}
              to apply the cipher.
            </WarningMessage>
          )}

          <textarea ref={this.createEditor} />
        </div>

        {this.props.query.drawer === '1' && (
          <OutletOccupant name="SPACE_DRAWER">
            <PageDrawer
              space={this.props.space}
              page={this.props.page}
              decryptedContent={this.props.decryptedContent}
              passPhrase={this.props.passPhrase}
              isRetrievingPassPhrase={this.props.isRetrievingPassPhrase}
            />
          </OutletOccupant>
        )}
      </div>
    );
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

  // renderSettingsMenu() {
  //   return (
  //     <ul className="page-settings-menu">
  //       <li>
  //         {this.props.page.encrypted ? (
  //           <Button hint="icon" onClick={this.removePageEncryption}>
  //             <Icon className="icon-no_encryption" />
  //             {' '}
  //             Stop encrypting this page
  //           </Button>
  //         ) : (
  //           <Button hint="icon" onClick={this.encryptPage}>
  //             <Icon className="icon-enhanced_encryption" />
  //             {' '}
  //             Encrypt this page
  //           </Button>
  //         )}
  //       </li>
  //     </ul>
  //   )
  // },

  createEditor(node) {
    const RULER = 80;

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

    this.editor = this.createEditor({ node: this.refs.editorNode });
    this.editor.setValue(this.props.page.content);
    this.editor.on('changes', this.emitChangeOfContent);

  },

  emitChangeOfContent(instance/*, changes*/) {
    console.debug('updating page content...');

    this.props.dispatch('UPDATE_PAGE_CONTENT', {
      pageId: this.props.page.id,
      folderId: this.props.page.folder_id,
      content: instance.doc.getValue()
    })
  },

  toggleDrawer() {
    this.props.dispatch('UPDATE_QUERY', {
      drawer: this.props.query.drawer === '1' ? null : '1'
    })
  },

  toggleSettingsMenu() {
    this.props.dispatch('UPDATE_QUERY', {
      'page-settings': this.props.query['page-settings'] === '1' ? null : '1'
    })
  },

  encryptPage() {
    if (!this.props.passPhrase) {
      console.warn('Unable to encrypt page; no pass-phrase available!');
      return;
    }

    this.props.dispatch('ENCRYPT_PAGE', {
      pageId: this.props.page.id,
      folderId: this.props.page.folder_id,
      content: this.props.page.content,
      passPhrase: this.props.passPhrase.value,
    })
  },

  requiresContentEncryption() {
    const { page } = this.props;

    return (
      page.encrypted && !page.digest
    )
  },

  syncContentWithCodeMirror(props) {
    const { editor } = this;
    let nextContent;

    if (props.page.encrypted && !props.decryptedContent) {
      nextContent = '';
    }
    else if (props.page.encrypted && props.decryptedContent) {
      nextContent = props.decryptedContent;
    }
    else {
      nextContent = props.page.content;
    }


  },

  // validateIntegrity({ folderId, pageId }) {
  //   this.props.dispatch('VALIDATE_PAGE_INTEGRITY', {
  //     pageId: this.props.page.id,
  //     folderId: this.props.page.folder_id,
  //     content: this.props.page.content,
  //     passPhrase: this.props.passPhrase.value,
  //   })
  // },
});

export default ActionEmitter(Page, {
  actions: [
    'FETCH_PAGE',
    'UPDATE_PAGE_CONTENT',
    'UPDATE_QUERY'
  ]
});
