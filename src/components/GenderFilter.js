import React from 'react';
import { NavDropdown, MenuItem } from 'react-bootstrap';

class GenderFilter extends React.Component {
  constructor(props) {
     super(props);
     this.setFilter = this.setFilter.bind(this);
     this.state = {
       selected: ''
     };
   }

  setFilter(tag) {
    this.setState({ selected: tag });
    this.props.handleGenderFilterChange(tag);
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
           <NavDropdown id="GenderFilter" title={this.props.genderfilterlabel} className="mb1">
              {this.renderButtons()}
           </NavDropdown>
         );
      }
}

export default GenderFilter;
