import React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

class StartpageSelector extends React.Component {
  constructor(props) {
     super(props);
     this.setStartpage = this.setStartpage.bind(this);
     this.state = {
       selected: ''
     };
   }

  setStartpage(page) {
    this.setState({ selected: page });
    this.props.handleStartpageChange(page);
  }

  isActive(value) {
    return ((value === this.state.selected) ? 'primary' : 'info');
  }

  renderPages() {
     return this.props.pages.map(page =>
      <Button
      key={page}
      className="mb1"
      bsStyle={this.isActive(page)}
      bsSize="xsmall"
      onClick={this.setStartpage.bind(this, page)}
      >
        {page}
      </Button>
    );
  }


   render() {
       return (
           <ButtonToolbar id="StartpageSelector" className="mb1">
              {this.renderPages()}
           </ButtonToolbar>
         );
      }
}

export default StartpageSelector;
