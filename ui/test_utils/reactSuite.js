import React from 'react';
import ReactDOM from 'react-dom';

export default reactSuite;

function reactSuite(mochaSuite, Type, initialProps) {
  const rs = {};

  rs.setProps = function(props) {
    rs.subject = render(Object.assign({}, rs.subject.props, props));
  };

  let container, subject;

  mochaSuite.beforeEach(function() {
    container = document.body.appendChild( document.createElement('div') );
    subject = render(evaluate(initialProps));

    rs.subject = subject;
  });

  mochaSuite.afterEach(function() {
    if (window.location.search.match(/inspect/)) {
      window.subject = subject;
      window.container = container;

      return;
    }

    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    subject = null;
    container = null;
  });

  function render(props) {
    return ReactDOM.render(<Type {...props} />, container);
  }

  return rs;
}

function evaluate(x) {
  return typeof x === 'function' ? x() : x;
}
