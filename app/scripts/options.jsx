function updateConfig(data) {
  chrome.storage.sync.set({
    config: data
  })
}

var ConfigForm = React.createClass({
  removeRow: function (index) {
    var configData = this.state.config;
    configData.splice(index, 1);
    //console.log('removeRow ', index);
    updateConfig(configData);
    this.setState({config: configData});
  },
  updateRow: function (index, row) {
    var configData = this.state.config;
    configData.splice(index, 1, row)
    //console.log('updateRow ', index, ' with ', row);
    updateConfig(configData);
    this.setState({config: configData});
  },
  newRow: function () {
    var configData = this.state.config;
    //console.log('newrow', configData);
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
      <form>
        <ConfigTable
          rows={this.state.config}
          removeRow={this.removeRow}
          updateRow={this.updateRow}
          newRow={this.newRow}
        />
      </form>
    )
  }
});

var ConfigTable = React.createClass({
  render: function () {
    var self = this;
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>{chrome.i18n.getMessage('configKeyword')}</th>
            <th>{chrome.i18n.getMessage('configRedirect')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {this.props.rows.map(function (row, index) {
            var row = {
              data: row,
              remove: function () {
                self.props.removeRow(index)
              },
              update: function (data) {
                self.props.updateRow(index, data)
              }
            }
            return <ConfigRow row={row}/>
          })}
          <tr>
            <td colSpan="3">
              <a className="btn btn-default btn-lg"
                onClick={this.props.newRow}>
                {chrome.i18n.getMessage('configNew')}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
});

var ConfigRow = React.createClass({
  updateFunc: function (field) {
    var data = this.props.row.data;
    return function (value) {
      data[field] = value;
      this.props.row.update(data)
    }.bind(this)
  },
  render: function () {
    return (
      <tr>
        <Field value={this.props.row.data.keyword} update={this.updateFunc('keyword')}/>
        <Field value={this.props.row.data.redirect} update={this.updateFunc('redirect')}/>
        <td>
          <a className="btn btn-default" onClick={this.props.row.remove}>X</a>
        </td>
      </tr>
    )
  }
});

var Field = React.createClass({
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
      ? <span onClick={this.active} ref='span'>{this.props.value}</span>
      : <span onClick={this.active} ref='span'>&nbsp;</span>
    return (
      <td className="config-field">
      {span}
        <input onBlur={this.update}
          onInput={this.input}
          type='text' ref='input' style={{display: 'none'}}/>
      </td>
    )
  }
})

React.render(
  <ConfigForm/>,
  document.getElementById('ConfigForm')
);

React.render(
  <div>
    <h1>{chrome.i18n.getMessage('optionTitle')}</h1>
    <p dangerouslySetInnerHTML={{__html: chrome.i18n.getMessage('optionDescription')}}></p>
  </div>,
  document.getElementById('Introduction')
)
