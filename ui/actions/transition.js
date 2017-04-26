module.exports = function transition(container, nextPathname) {
  const { history } = container.refs.router;

  history.push(nextPathname)
};