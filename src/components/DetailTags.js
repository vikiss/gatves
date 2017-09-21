import React, { Component } from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import DetailTag from './DetailTag';

class DetailTags extends Component {
  constructor(props) {
    super(props);
    this.state = { tagarray: [] };
    if (props.tags) this.state = { tagarray: props.tags.split(',') };
 }

 renderTags() {
    return this.state.tagarray.map(tag =>
     <DetailTag key={tag} tag={tag} onClick={() => console.log({ tag } )} />
   );
 }


  render() {
      return (
        <ButtonToolbar>
           {this.renderTags()}
        </ButtonToolbar>
        );
     }


}

export default DetailTags;
