const React = require('react')
const MemberLayout = require('components/MemberLayout');

module.exports = Component => React.createClass({
  displayName: `inLayout(${Component.displayName})`,
  render() {
    return <MemberLayout><Component {...this.props} /></MemberLayout>
  }
})