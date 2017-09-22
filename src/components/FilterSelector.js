import React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

class FilterSelector extends React.Component {
  constructor(props) {
     super(props);
     this.setFilter = this.setFilter.bind(this);
     this.state = {
       selected: ''
     };
   }

  setFilter(tag) {
    this.setState({ selected: tag });
    this.props.handleFilterChange(tag);
  }

  isActive(value) {
    return ((value === this.state.selected) ? 'primary' : 'info');
  }

  renderButtons() {
    return Object.keys(this.props.filters).map(tag =>
      <Button
      key={tag}
      className="mb1"
      bsStyle={this.isActive(tag)}
      bsSize="xsmall"
      onClick={this.setFilter.bind(this, tag)}
      >
        {this.props.filters[tag]}
      </Button>
    );
  //console.log(`obj.${prop} = ${this.props.filters[prop]}`);
  }


   render() {
       return (
           <ButtonToolbar id="FilterSelector" className="mb1">
              {this.renderButtons()}
           </ButtonToolbar>
         );
      }
}

export default FilterSelector;
