import React from 'react';
import { Label } from 'react-bootstrap';

const DetailTag = (props) =>
 (
    <Label
    className="mb1 mr1"
    bsStyle="info"
    bsSize="xsmall"
    >
      {props.tag}
    </Label>
  );


export default DetailTag;
