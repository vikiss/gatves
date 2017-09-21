import React from 'react';

class Footer extends React.Component {
   render() {
      return (
         <p className="text-muted">
            <small>{this.props.footerText}</small>
         </p>
      );
   }
}

export default Footer;
