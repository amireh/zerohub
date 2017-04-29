const { request } = require('services/PageHub');

module.exports = function updatePage({ setState }, { pageId, attributes }) {
  setState({ saving: true, saveError: null, })

  return request({
    url: `/api/v2/pages/${pageId}`,
    method: 'PATCH',
    body: {
      page: attributes
    }
  }).then(payload => {
    setState({ saving: false, saveError: null, });
    return payload;
  }).catch(e => {
    setState({ saving: false, saveError: true, });

    throw e;
  });
}