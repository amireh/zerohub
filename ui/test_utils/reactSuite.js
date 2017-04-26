const React = require('react');
const ReactDOM = require('react-dom');
const { drill } = require('react-drill');

module.exports = reactSuite;

function reactSuite(mochaSuite, Type, initialProps) {
  const rs = {};

  rs.setProps = function(props) {
    rs.subject = render(Object.assign({}, rs.subject.props, props));
  };

  rs.mount = function(props) {
    if (container) {
      rs.unmount();
    }

    container = document.body.appendChild( document.createElement('div') );
    subject = render(Object.assign({}, evaluate(initialProps), props));

    rs.subject = subject;
    rs.component = subject;
    rs.scope = drill(subject);
  };

  rs.unmount = function() {
    rs.scope = null;
    rs.component = null;
    rs.subject = null;

    if (container) {
      ReactDOM.unmountComponentAtNode(container);
      container.remove();
      container = null;
    }

    subject = null;
  };

  let container, subject;

  mochaSuite.beforeEach(function() {
    rs.mount();
  });

  mochaSuite.afterEach(function() {
    rs.unmount();
  });

  function render(props) {
    return ReactDOM.render(<Type {...props} />, container);
  }

  return rs;
}

function evaluate(x) {
  return typeof x === 'function' ? x() : x;
}
