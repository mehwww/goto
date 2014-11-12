function updateConfig(data) {
  console.log('update config', data);
  chrome.storage.sync.set({
    config: data
  })
}

var ConfigForm = React.createClass({displayName: 'ConfigForm',
  removeRow: function (index) {
    var configData = this.state.config;
    configData.splice(index, 1);
    console.log('removeRow ', index);
    updateConfig(configData);
    this.setState({config: configData});
  },
  updateRow: function (index, row) {
    var configData = this.state.config;
    configData.splice(index, 1, row)
    console.log('updateRow ', index, ' with ', row);
    updateConfig(configData);
    this.setState({config: configData});
  },
  newRow: function () {
    var configData = this.state.config;
    console.log('newrow', configData);
    configData.push({
      keyword: '',
      redirect: ''
    });
    updateConfig(configData);
    this.setState({config: configData});
  },
  getInitialState: function () {
    return {
      config: []
    };
  },
  componentWillMount: function () {
    chrome.storage.sync.get('config', function (result) {
      this.setState({config: result.config});
    }.bind(this))
  },
  render: function () {
    var props = {
      rows: this.state.config,
      removeRow: this.removeRow,
      updateRow: this.updateRow
    }
    return (
      React.createElement("form", null, 
        React.createElement(ConfigTable, {
          rows: this.state.config, 
          removeRow: this.removeRow, 
          updateRow: this.updateRow, 
          newRow: this.newRow}
        )
      )
    )
  }
});

var ConfigTable = React.createClass({displayName: 'ConfigTable',
  render: function () {
    var self = this;
    return (
      React.createElement("table", {className: "table table-striped"}, 
        React.createElement("thead", null, 
          React.createElement("tr", null, 
            React.createElement("th", null, chrome.i18n.getMessage('configKeyword')), 
            React.createElement("th", null, chrome.i18n.getMessage('configRedirect')), 
            React.createElement("th", null)
          )
        ), 
        React.createElement("tbody", null, 
          this.props.rows.map(function (row, index) {
            var row = {
              data: row,
              remove: function () {
                self.props.removeRow(index)
              },
              update: function (data) {
                self.props.updateRow(index, data)
              }
            }
            return React.createElement(ConfigRow, {row: row})
          }), 
          React.createElement("tr", null, 
            React.createElement("td", {colSpan: "3"}, 
              React.createElement("a", {className: "btn btn-default btn-lg", 
                onClick: this.props.newRow}, 
                chrome.i18n.getMessage('configNew')
              )
            )
          )
        )
      )
    )
  }
});

var ConfigRow = React.createClass({displayName: 'ConfigRow',
  updateFunc: function (field) {
    var data = this.props.row.data;
    return function (value) {
      data[field] = value;
      this.props.row.update(data)
    }.bind(this)
  },
  render: function () {
    return (
      React.createElement("tr", null, 
        React.createElement(Field, {value: this.props.row.data.keyword, update: this.updateFunc('keyword')}), 
        React.createElement(Field, {value: this.props.row.data.redirect, update: this.updateFunc('redirect')}), 
        React.createElement("td", null, 
          React.createElement("a", {className: "btn btn-default", onClick: this.props.row.remove}, "X")
        )
      )
    )
  }
});

var Field = React.createClass({displayName: 'Field',
  update: function () {
    var span = this.refs.span.getDOMNode();
    var input = this.refs.input.getDOMNode();
    span.style.display = '';
    input.style.display = 'none';
    this.props.update(input.value.trim());
  },
  active: function () {
    var span = this.refs.span.getDOMNode();
    var input = this.refs.input.getDOMNode();
    span.style.display = 'none';
    input.style.display = '';
    input.value = span.textContent.trim();
    input.focus();
  },
  input: function (e) {
    //console.log(e.target);
  },
  render: function () {
    var span = this.props.value
      ? React.createElement("span", {onClick: this.active, ref: "span"}, this.props.value)
      : React.createElement("span", {onClick: this.active, ref: "span"}, " ")
    return (
      React.createElement("td", {className: "config-field"}, 
      span, 
        React.createElement("input", {onBlur: this.update, 
          onInput: this.input, 
          type: "text", ref: "input", style: {display: 'none'}})
      )
    )
  }
})

React.render(
  React.createElement(ConfigForm, null),
  document.getElementById('ConfigForm')
);
