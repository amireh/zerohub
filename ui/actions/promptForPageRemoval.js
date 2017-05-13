const { send } = require('services/CoreDelegate');
const discardCarriage = require('utils/discardCarriage');
const Promise = require('Promise');

module.exports = function promptForPageRemoval() {
  return send('OPEN_MODAL', {
    type: 'question',
    buttons: [
      I18n.t('Cancel'),
      I18n.t('Remove Page')
    ],
    defaultId: 1,
    cancelId: 0,
    message: discardCarriage(`
Removing a page is currently undoable, you will not have access to this page\r
again! Are you sure you want to do this?`)
  }).then(({ response }) => {
    return response === 1 ? Promise.resolve() : Promise.reject();
  })
};
