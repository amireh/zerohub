const React = require('react');
const Link = require('components/Link');

const Home = React.createClass({
  render() {
    return (
      <div>
        <Link to="/spaces">Spaces</Link>
      </div>
    );
  }
});

module.exports = Home;
