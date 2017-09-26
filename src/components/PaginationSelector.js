import React from 'react';
import { ButtonToolbar, SplitButton, MenuItem } from 'react-bootstrap';

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
         <ButtonToolbar>
           <SplitButton dropup id="CountSelector" title={this.props.paginationlabel} className="">
              {this.renderCounts()}
           </SplitButton>
          </ButtonToolbar>
         );
      }
}

export default PaginationSelector;
