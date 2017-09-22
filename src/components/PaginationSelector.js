import React from 'react';
import { Nav, NavDropdown, MenuItem } from 'react-bootstrap';

class PaginationSelector extends React.Component {
  constructor(props) {
     super(props);
     this.setPagination = this.setPagination.bind(this);
     this.state = {
       selected: ''
     };
   }

  setPagination(count) {
    this.setState({ selected: count });
    this.props.handlePaginationChange(count);
  }

  isActive(value) {
    return ((value === this.state.selected) ? 'primary' : 'info');
  }

  renderCounts() {
     return this.props.counts.map(count =>
      <MenuItem
      key={count}
      className="mb1"
      bsStyle={this.isActive(count)}
      bsSize="xsmall"
      onClick={this.setPagination.bind(this, count)}
      >
        {count} eil./psl.
      </MenuItem>
    );
  }


   render() {
       return (
         <Nav bsStyle="pills">
           <NavDropdown id="CountSelector" title={this.props.paginationlabel} className="mb1">
              {this.renderCounts()}
           </NavDropdown>
          </Nav>
         );
      }
}

export default PaginationSelector;
