const { request } = require('services/PageHub');

module.exports = function fetchSpace(container, { spaceId }) {
  container.setState({ loadingSpace: true });

  return Promise.all([
    request({ url: `/api/v2/spaces/${spaceId}` }),
    request({ url: `/api/spaces/${spaceId}/folders` }),
    request({ url: `/api/v2/pages?space_id=${spaceId}` }),
  ]).then(payloads => {
    container.setState({
      loadingSpace: false,
      space: payloads[0].spaces[0],
      folders: payloads[1].folders,
      pages: payloads[2].pages,
    })
  }).catch(error => {
    container.setState({ loadingSpace: false, spaceLoadError: true })

    throw error;
  });
}
