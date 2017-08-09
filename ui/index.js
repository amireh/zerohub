require('./boot');
const React = require('react');
const { render } = require('react-dom');
const Root = require('./screens/Root');

render(<Root />, document.body.querySelector('#app'));