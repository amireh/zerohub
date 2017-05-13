const React = require('react');
const { remote } = electronRequire('electron');
const { PropTypes } = React;

const ProgressBar = React.createClass({
  propTypes: {
    progress: PropTypes.number,
  },

  componentDidMount() {
    remote.getCurrentWindow().setProgressBar(0);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.progress !== this.props.progress) {
      remote.getCurrentWindow().setProgressBar(nextProps.progress / 100);
    }
  },

  componentWillUnmount() {
    remote.getCurrentWindow().setProgressBar(-1);
  },

  render() {
    const { progress } = this.props;

    return (
      <div className="progress-bar margin-tb-m">
        <div className="progress-bar__bar" style={{ width: `${progress}%` }} />
      </div>
    );
  }
});

module.exports = ProgressBar;
