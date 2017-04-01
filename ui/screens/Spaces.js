import React, { PropTypes } from 'react';
import { ActionProvider } from 'cornflux';
import * as PageHub from 'services/PageHub';
import Link from 'components/Link';

const Spaces = React.createClass({
  contextTypes: {
    dispatch: PropTypes.func,
  },

  getInitialState() {
    return {
      spaces: [],
      loadingSpaces: false,
      spaceLoadError: null,
    };
  },

  componentDidMount() {
    this.context.dispatch('FETCH_SPACES', { userId: 1 });
  },

  render() {
    return (
      <div>
        {this.state.loadingSpaces && <p>Loading spaces...</p>}
        {this.state.spaceLoadError && (
          <p className="error-notification">
            Error loading spaces!
          </p>
        )}

        {this.state.spaces.map(this.renderSpace)}
      </div>
    );
  },

  renderSpace(space) {
    return (
      <div key={space.id}>
        <Link to={`/spaces/${space.id}`}>{space.title}</Link>
      </div>
    )
  }
});

export default ActionProvider(Spaces, {
  actions: {
    FETCH_SPACES(container, { userId }) {
      container.setState({ loadingSpaces: true });

      return PageHub.request({
        url: `/api/users/${userId}/spaces`
      }).then(response => {
        container.setState({ spaces: response.responseJSON.spaces })
      }, error => {
        console.error('request failed:', error)
        container.setState({ spaceLoadError: true })
      }).then(() => {
        container.setState({ loadingSpaces: false });
      })

      // return Promise.resolve();
    }
  }
});
