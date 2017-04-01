import React from 'react';
import Link from 'components/Link';

const Home = React.createClass({
  render() {
    return (
      <div>
        <Link to="/spaces">Spaces</Link>
      </div>
    );
  }
});

export default Home;
