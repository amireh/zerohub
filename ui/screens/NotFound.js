const React = require('react');
const Icon = require('components/Icon');
const { Link } = require('react-router-dom');

const NotFound = React.createClass({
  render() {
    return (
      <div className="not-found" style={{ textAlign: 'center' }}>
        <h1>404 - Not Found</h1>

        <Icon className="icon-sentiment_very_dissatisfied" style={{ fontSize: '96px' }} />

        <p>
          DOH!
        </p>

        <p>
          <Link to="/">
            Back
          </Link>
        </p>
      </div>
    );
  }
});

module.exports = NotFound;
