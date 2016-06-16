var React = require('react');

var angular = require('angular');
require('ngreact');

var app = angular.module('app', ['react']);

app.factory('GridService', function($q, $timeout) {
  var records = [
    {
      name: 'bob',
      age: 50
    },
    {
      name: 'joe',
      age: 45
    },
    {
      name: 'jen',
      age: 25
    }
  ].map(function(record, index) {
    record.id = index + 1;
    return record;
  });

  return {
    loadRecords: loadRecords
  };

  function loadRecords() {
    return $timeout(function() {
      return records;
    }, 500);
  }
});

app.value('Page', require('./page'));

app.factory('FakeRedux', function($timeout) {
  return {
    createStore: createStore,
    combineReducers: combineReducers
  };

  function combineReducers(reducersBySubTreeProperty) {
    var subTreeProperties = Object.keys(reducersBySubTreeProperty);

    return function combinedReducer(state, action) {
      return subTreeProperties.reduce(function(newState, property) {
        var oldSubTree = state[property];
        var subTreeReducer = reducersBySubTreeProperty[property];
        var newSubTree = subTreeReducer(oldSubTree, action);

        newState[property] = newSubTree;

        return newState;
      }, {});
    };
  }

  function createStore(options) {
    var state = options.initialState || {};
    var onStateChange = options.onStateChange;
    var debug = options.debug || false;

    return {
      dispatch: dispatch,
      reducer: defaultReducer
    };

    function dispatch(action) {
      if (debug) console.debug('action dispatched:', action);

      var newState = this.reducer(state, action);

      if (newState !== state) {
        if (debug) console.debug('new state:', newState);

        state = newState;
        $timeout(function() {
          onStateChange(newState);
        });
      }
    }

    function defaultReducer(state, action) {
      console.warn('store.reducer was not set');
      return state;
    }
  }
});

app.factory('ManagePeopleActions', function() {
  return {
    LOAD_RECORDS_BEGIN: 'LOAD_RECORDS_BEGIN',
    LOAD_RECORDS_COMPLETE: 'LOAD_RECORDS_COMPLETE',
    REMOVE_PERSON: 'REMOVE_PERSON',
    ADD_PERSON: 'ADD_PERSON',
    TOGGLE_PERSON: 'TOGGLE_PERSON'
  };
});

app.factory('ManagePeopleActionCreator', function(ManagePeopleActions) {
  var actions = ManagePeopleActions;

  return {
    loadRecordsBegin: loadRecordsBegin,
    loadRecordsComplete: loadRecordsComplete,
    removePerson: removePerson,
    addPerson: addPerson,
    togglePerson: togglePerson
  };

  function togglePerson(id) {
    return {
      type: actions.TOGGLE_PERSON,
      id: id
    };
  }

  function addPerson(name, age) {
    return {
      type: actions.ADD_PERSON,
      name: name,
      age: age
    };
  }

  function loadRecordsBegin() {
    return {
      type: actions.LOAD_RECORDS_BEGIN
    };
  }

  function loadRecordsComplete(records) {
    return {
      type: actions.LOAD_RECORDS_COMPLETE,
      records: records
    };
  }

  function removePerson(id) {
    return {
      type: actions.REMOVE_PERSON,
      id: id
    };
  }
});

app.directive('managePeople', [function() {
  return {
    restrict: 'E',
    controller: function(FakeRedux, ManagePeopleActionCreator, ManagePeopleActions, GridService, $scope) {
      var assign = angular.extend;

      var actions = ManagePeopleActions;
      var create = ManagePeopleActionCreator;

      var initialState = {
        grid: {
          records: [],
          loading: true,
          onRemovePerson: function(id) {
            store.dispatch(create.removePerson(id));
          },
          onTogglePerson: function(id) {
            store.dispatch(create.togglePerson(id));
          }
        },
        addPersonForm: {
          onAddPerson: function(name, age) {
            store.dispatch(create.addPerson(name, age));
          }
        }
      };

      var store = FakeRedux.createStore({
        initialState: initialState,
        onStateChange: updateStateOnScope,
        debug: true
      });

      updateStateOnScope(initialState);

      function updateStateOnScope(newState) {
        $scope.state = newState;
      }

      store.reducer = FakeRedux.combineReducers({
        grid: gridReducer,
        addPersonForm: addPersonFormReducer
      });

      function gridReducer(grid, action) {
        if (action.type == actions.LOAD_RECORDS_COMPLETE) {
          var newRecords = action.records.map(function(record) {
            return assign({}, record, {
              expanded: false
            });
          });

          return assign({}, grid, {
            loading: false,
            records: newRecords
          });
        } else if (action.type == actions.REMOVE_PERSON) {
          var newRecords = grid.records.filter(function(record) {
            return record.id !== action.id;
          });

          return assign({}, grid, {
            records: newRecords
          });
        } else if (action.type == actions.LOAD_RECORDS_BEGIN) {
          return assign({}, grid, {
            loading: true
          });
        } else if (action.type == actions.ADD_PERSON) {
          var nextId = Math.max.call(Math, ...grid.records.map(record => record.id), 0) + 1;
          var newRecord = {
            id: nextId,
            name: action.name,
            age: action.age,
            expanded: false
          };

          return assign({}, grid, {
            records: grid.records.concat(newRecord)
          });
        } else if (action.type === actions.TOGGLE_PERSON) {
          var toggleIndex = grid.records.findIndex(r => r.id === action.id);
          var toggleRecord = grid.records[toggleIndex];
          var newRecord = assign({}, toggleRecord, {
            expanded: !toggleRecord.expanded
          });
          var before = grid.records.slice(0, toggleIndex);
          var after = grid.records.slice(toggleIndex + 1);
          var newRecords = before.concat(newRecord).concat(after);

          return assign({}, grid, {
            records: newRecords
          });
        }

        return grid;
      }

      function addPersonFormReducer(addPersonForm, action) {
        return addPersonForm;
      }

      store.dispatch({
        type: 'NO_OP'
      });

      store.dispatch(create.loadRecordsBegin());

      GridService.loadRecords().then(function(records) {
        store.dispatch(create.loadRecordsComplete(records));
      });
    },
    template: '<react-component name="Page" props="state" watch-depth="reference"></react-component>'
  };
}]);

/*

scope.state is the entire state of the page

an action is an object with a type and some other data

{
  type: '...'
  // action-specific data here
}

every time an action is dispatched...

call a reducer function with (current state, action)

the reducer function returns the new state

if new state !== old state, set scope.state = new state

 */
