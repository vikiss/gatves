import React from 'react';
import { Panel, Glyphicon } from 'react-bootstrap';


class StatusMessage extends React.Component {

   render() {
      return (
         <Panel>
         <Glyphicon glyph="info-sign" className="mr1 text-success" />
            {this.props.statusText}
         </Panel>
      );
   }
}


export default StatusMessage;
