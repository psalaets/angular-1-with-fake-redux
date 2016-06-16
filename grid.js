var React = require('react');

module.exports = React.createClass({
  displayName: 'Grid',
  propTypes: {
    records: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        id: React.PropTypes.number,
        name: React.PropTypes.string,
        age: React.PropTypes.number,
        expanded: React.PropTypes.bool
      })
    ),
    loading: React.PropTypes.bool,
    onRemovePerson: React.PropTypes.func,
    onTogglePersonDetails: React.PropTypes.func
  },
  render: function() {
    if (this.props.loading) {
      return (
        <div>
          Loading...
        </div>
      );
    }

    var header = this.renderHeader();
    var body = this.renderBody(this.props);

    return (
      <table>
        {header}
        {body}
      </table>
    );
  },
  renderHeader: function() {
    return (
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Age</th>
          <th>Expanded</th>
          <th>Actions</th>
        </tr>
      </thead>
    );
  },
  renderBody: function(props) {
    var rows = props.records.map(function(record) {
      return this.renderRow(record, props);
    }, this);

    return (
      <tbody>
        {rows}
      </tbody>
    );
  },
  renderRow: function(record, props) {
    var buttons = this.renderButtons(record, props);

    return (
      <tr key={record.id}>
        <td>{record.id}</td>
        <td>{record.name}</td>
        <td>{record.age}</td>
        <td>{String(record.expanded)}</td>
        <td>{buttons}</td>
      </tr>
    );
  },
  renderButtons: function(personRecord, props) {
    var removeButton = this.renderRemoveButton(personRecord, props);
    var toggleButton = this.renderToggleButton(personRecord, props);

    return (
      <div>
        {removeButton}
        {toggleButton}
      </div>
    );
  },
  renderRemoveButton: function(personRecord, props) {
    var onRemovePerson = props.onRemovePerson;

    return (
      <button onClick={onRemovePerson.bind(null, personRecord.id)}>Remove</button>
    );
  },
  renderToggleButton: function(personRecord, props) {
    var onTogglePerson = props.onTogglePerson;

    return (
      <button onClick={onTogglePerson.bind(null, personRecord.id)}>Toggle</button>
    );
  }
});
