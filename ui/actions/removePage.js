const { request } = require('services/PageHub');

module.exports = function removePage({ pageId }) {
  return (
    request({
      method: 'DELETE',
      url: `/api/v2/pages/${pageId}`
    })
  );
}
