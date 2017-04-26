const { request } = require('services/PageHub');

module.exports = function fetchSpaces(container, {}) {
  container.setState({ loadingSpaces: true });

  return request({ url: `/api/v2/spaces` }).then(payload => {
    container.setState({
      loadingSpaces: false,
      spaces: payload.spaces
    })
  }).catch(() => {
    container.setState({
      loadingSpaces: false,
      spacesLoadError: true
    })
  })
}