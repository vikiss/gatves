import React from 'react';

class Cbox extends React.Component {
  constructor(props) {
    super(props);
    this.setCboxStatus = this.setCboxStatus.bind(this);
    this.state = {
      record: this.props.record,
      checked: false,
    };
  }


  setCboxStatus() {
    const newStatus = !this.state.checked;
    this.setState({ checked: newStatus }, () => {
    this.props.handleDeletionQueue(this.state.record, newStatus);
  });
  }

  render() {
      return (
      <div>
          <input
              type="checkbox"
              onChange={this.setCboxStatus}
              id={this.state.id}
              checked={this.state.checked}
          />
          </div>
        );
     }
}


export default Cbox;
