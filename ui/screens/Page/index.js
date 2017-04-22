import React, { PropTypes } from 'react';
import { ActionProvider } from 'cornflux';
import Page from './Page';
import * as Actions from './Actions';

const PageRouteHandler = React.createClass({
  contextTypes: {
    config: PropTypes.object,
  },

  propTypes: {
    dispatch: PropTypes.func.isRequired,

    space: PropTypes.shape({
      id: PropTypes.string.isRequired,
      encrypted: PropTypes.bool.isRequired,
    }).isRequired,

    params: PropTypes.shape({
      pageId: PropTypes.string.isRequired,
    }).isRequired,

    query: PropTypes.shape({
      'drawer': PropTypes.oneOf([ '1', null ]),
      'page-settings': PropTypes.oneOf([ '1', null ]),
    }).isRequired,
  },

  getInitialState() {
    return {
      loading: false,
      loadError: null,
      page: null,
    };
  },

  componentDidMount() {
    this.props.dispatch('FETCH_PAGE', {
      pageId: this.props.params.pageId,
    });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.pageId !== this.props.params.pageId) {
      this.props.dispatch('FETCH_PAGE', {
        pageId: nextProps.params.pageId,
      });
    }
  },

  render() {
    return (
      <Page
        {...this.state}
        {...this.props}
      />
    );
  },
});

export default ActionProvider(PageRouteHandler, {
  actions: Actions,
});
