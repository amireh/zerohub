const Promise = require('Promise');
const { request } = require('services/PageHub');
const ErrorCodes = require('ErrorCodes');

module.exports = function createPage({ folderId, spaceId }) {
  const parsePage = payload => payload.pages[0];
  const emitError = errorCode => () => Promise.reject(errorCode);

  return (
    request({
      method: 'POST',
      url: `/api/v2/pages`,
      body: {
        space_id: spaceId,
        folder_id: folderId || null
      }
    })
    .then(
      parsePage,
      emitError(ErrorCodes.PAGE_FETCH_ERROR)
    )
  );
}
