import React from 'react';
import { Nav, NavDropdown, MenuItem } from 'react-bootstrap';

class SortSelector extends React.Component {
  constructor(props) {
     super(props);
     this.setSort = this.setSort.bind(this);
     this.state = {
       selected: ''
     };
   }

  setSort(tag) {
    this.setState({ selected: tag });
    this.props.handleSortChange(tag);
  }

  isActive(value) {
    return ((value === this.state.selected) ? 'primary' : 'info');
  }

  renderButtons() {
    return Object.keys(this.props.sorts).map(tag =>
      <MenuItem
      key={tag}
      className="mb1"
      bsStyle={this.isActive(tag)}
      bsSize="xsmall"
      onClick={this.setSort.bind(this, tag)}
      >
        {this.props.sorts[tag]}
      </MenuItem>
    );
  }


   render() {
       return (
         <Nav bsStyle="pills">
           <NavDropdown id="SortSelector" title={this.props.sortlabel} className="mb1">
              {this.renderButtons()}
           </NavDropdown>
          </Nav>
         );
      }
}

export default SortSelector;
