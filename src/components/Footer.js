import React from 'react';
import { Row, Col } from 'react-bootstrap';

class Footer extends React.Component {
   render() {
      return (
        <Row>
         <Col md={12}>
         <p className="text-muted text-right">
            <small>
              <a href={this.props.hrefText}>
                {this.props.footerText}
              </a>
            </small>
         </p>
         </Col>
         </Row>
      );
   }
}

export default Footer;
