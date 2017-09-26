import React from 'react';
import { Pagination } from 'react-bootstrap';

class PaginationStrip extends React.Component {
  constructor(props) {
    super(props);
    this.setPageNo = this.setPageNo.bind(this);
  }

  setPageNo(value) {
    this.props.handlePageChange(value);
  }

  render() {
      return (
        <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            items={this.props.total}
            maxButtons={5}
            activePage={this.props.activePage}
            onSelect={this.setPageNo}
        />
        );
     }
}


export default PaginationStrip;
