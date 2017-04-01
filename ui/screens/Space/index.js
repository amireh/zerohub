import React, { PropTypes } from 'react';
import { ActionProvider } from 'cornflux';
import { Route } from 'react-router-dom';
import * as PageHub from 'services/PageHub';
import Link from 'components/Link';
import Icon from 'components/Icon';
import SpaceBrowser from './SpaceBrowser';
import Page from './Page';

const BackToLibraryButton = React.createClass({
  render() {
    return (
      <div className="book__back-to-library" {...this.props}>
        <Link to="/spaces"><Icon className="icon-arrow_back" /> Back to Library</Link>
      </div>
    );
  }
});

const Space = React.createClass({
  contextTypes: {
    dispatch: PropTypes.func,
    config: PropTypes.object,
  },

  getInitialState() {
    return {
      space: null,
      loadingSpace: false,
      spaceLoadError: null,
    };
  },

  componentDidMount() {
    const { config } = this.context;

    this.context.dispatch('FETCH_SPACE', {
      userId: config.userId,
      spaceId: this.props.params.id
    });
  },

  render() {
    return (
      <div>
        {this.state.loadingSpace && <p>Loading space data...</p>}

        {this.state.spaceLoadError && (
          <p className="error-notification">
            Error loading space data!
          </p>
        )}

        {this.state.space && this.renderSpace(this.state.space)}
      </div>
    );
  },

  renderSpace(space) {
    return (
      <div className="pure-g space">
        <div className="pure-u-1-4 space__sidebar-container">
          <header className="space__title">
            <Link to={`/spaces/${space.id}`}>{space.title}</Link>
          </header>

          <SpaceBrowser
            space={space}
            match={this.props.match}
          />

          <BackToLibraryButton />
        </div>

        <div className="pure-u-3-4 space__content-container">
          <Route
            exact
            path={`${this.props.match.url}/pages/:id`}
            render={({ match }) => {
              const { params } = match;
              return <Page page={space.pages.filter(x => x.id === params.id)[0]} />
            }}
          />
        </div>
      </div>
    )
  }
});

export default ActionProvider(Space, {
  actions: {
    FETCH_SPACE(container, { userId, spaceId }) {
      container.setState({ loadingSpace: true });

      return PageHub.request({
        url: `/api/users/${userId}/spaces/${spaceId}`
      }).then(response => {
        container.setState({ space: response.responseJSON.spaces[0] })
      }, error => {
        console.error('request failed:', error)
        container.setState({ spaceLoadError: true })
      }).then(() => {
        container.setState({ loadingSpace: false });
      })

      // return Promise.resolve();
    }
  }
});
