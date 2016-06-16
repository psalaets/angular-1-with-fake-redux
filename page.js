var React = require('react');

var Grid = require('./grid');
var AddPersonForm = require('./add-person-form');

module.exports = React.createClass({
  displayName: 'Page',
  propTypes: {
    addPersonForm: React.PropTypes.object,
    grid: React.PropTypes.object
  },
  render: function() {
    return (
      <div>
        <h1>Manage People</h1>
        <h2>Add Person</h2>
        <AddPersonForm {...this.props.addPersonForm}/>
        <h2>People</h2>
        <Grid {...this.props.grid}/>
      </div>
    );
  }
});