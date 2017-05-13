const React = require('react');
const { PropTypes } = React;
const { actions } = require('actions');

const SpaceExport = React.createClass({
  propTypes: {
    type: PropTypes.oneOf([ 'json', 'zip' ]),
  },

  getInitialState() {
    return {
      passPhrase: null,
      space: null,
      pages: [],
    };
  },

  componentDidMount() {
    const userId = this.props.user.id;
    const spaceId = this.props.params.id;

    actions.exportSpace({
      format: actions.exportSpace.FORMAT_JSON,
      userId,
      spaceId,
      tickFn: () => {}
    })
  },

  render() {
    return (
      <div className="space-export" />
    );
  },
});

module.exports = SpaceExport;
