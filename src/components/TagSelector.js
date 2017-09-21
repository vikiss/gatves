import React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

class TagSelector extends React.Component {
  constructor(props) {
     super(props);
     this.setFilter = this.setFilter.bind(this);
     this.state = {
       selected: ''
     };
   }

  setFilter(tag) {
    this.setState({ selected: tag });
    this.props.handleTagChange(tag);
  }

  isActive(value) {
    return ((value === this.state.selected) ? 'primary' : 'info');
  }

  renderTags() {
     return this.props.tags.map(tag =>
      <Button
      key={tag}
      className="mb1"
      bsStyle={this.isActive(tag)}
      bsSize="xsmall"
      onClick={this.setFilter.bind(this, tag)}
      >
        {tag}
      </Button>
    );
  }

  /* onClick={props.onClick} */


   render() {
       return (
           <ButtonToolbar id="TagSelector" className="mb1">
             <Button
             key="all"
             className="mb1"
             bsStyle={this.isActive('')}
             bsSize="xsmall"
             onClick={this.setFilter.bind(this, '')}
             >
             Everything
             </Button>
              {this.renderTags()}
           </ButtonToolbar>
         );
      }
}

export default TagSelector;
