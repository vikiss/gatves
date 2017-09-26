import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class ModalConfirmation extends React.Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.execute = this.execute.bind(this);
    this.state = {
        showModal: false
    };
  }


  execute() {
    this.props.handleConfirmation();
  }

  close() {
      this.props.handleModalToggle();
  }

  render() {
  return (
      <Modal show={this.props.showModal} onHide={this.close}>
        <Modal.Body>
          <h4>{this.props.body}</h4>
          <p>{this.props.count}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="success" onClick={this.close}>{this.props.cancelLabel}</Button>
          <Button bsStyle="danger" onClick={this.execute}>{this.props.confirmLabel}</Button>
        </Modal.Footer>
      </Modal>
  );
}
}


export default ModalConfirmation;
