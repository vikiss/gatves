import React from 'react';
import { PageHeader } from 'react-bootstrap';

class Header extends React.Component {
   render() {
      return (
         <PageHeader>
            {this.props.headerText}
         </PageHeader>
      );
   }
}


export default Header;
