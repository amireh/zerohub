const { send } = require('services/CoreDelegate');
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
    message: `There's no going back to this page once you remove it! Are you sure you want to do this?`
  }).then(({ response }) => {
    return response === 1 ? Promise.resolve() : Promise.reject();
  })
};
