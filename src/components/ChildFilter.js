import React from 'react';
import { NavDropdown, MenuItem } from 'react-bootstrap';

class ChildFilter extends React.Component {
  constructor(props) {
     super(props);
     this.setFilter = this.setFilter.bind(this);
     this.state = {
       selected: ''
     };
   }

  setFilter(tag) {
    this.setState({ selected: tag });
    this.props.handleChildFilterChange(tag);
  }

  isActive(value) {
    return ((value === this.state.selected) ? 'primary' : 'info');
  }

  renderButtons() {
    return Object.keys(this.props.filters).map(tag =>
      <MenuItem
      key={tag}
      className="mb1"
      bsStyle={this.isActive(tag)}
      bsSize="xsmall"
      onClick={this.setFilter.bind(this, tag)}
      >
        {this.props.filters[tag]}
      </MenuItem>
    );
  }


   render() {
       return (
           <NavDropdown id="ChildFilter" title={this.props.childfilterlabel} className="mb1">
              {this.renderButtons()}
           </NavDropdown>
         );
      }
}

export default ChildFilter;
