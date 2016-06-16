var React = require('react');

module.exports = React.createClass({
  displayName: 'AddPersonForm',
  propTypes: {
    onAddPerson: React.PropTypes.func
  },
  render: function() {
    return (
      <div>
        <div>
          <label>
            Name
            <input type="text" ref={this.acceptNameInputRef}/>
          </label>
        </div>
        <div>
          <label>
            Age
            <input type="number" ref={this.acceptAgeInputRef}/>
          </label>
        </div>
        <button onClick={this.handleAddPerson}>Add</button>
      </div>
    );
  },
  acceptNameInputRef: function(element) {
    this.nameInput = element;
  },
  acceptAgeInputRef: function(element) {
    this.ageInput = element;
  },
  handleAddPerson: function() {
    var name = this.nameInput.value;
    var age = Number(this.ageInput.value);

    if (name && (age || age === 0)) {
      this.props.onAddPerson(name, age);
      this.clearInputs();
    }
  },
  clearInputs: function() {
    this.nameInput.value = this.ageInput.value = '';
  }
});
