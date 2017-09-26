import React from 'react';
import { Table, ButtonToolbar, Button, Glyphicon } from 'react-bootstrap';
import Cbox from './Cbox';
import ModalConfirmation from './ModalConfirmation';
import UploadDialog from './UploadDialog';

class ResidentTable extends React.Component {
  constructor(props) {
    super(props);
    this.handleDeletionQueue = this.handleDeletionQueue.bind(this);
    this.setDelButonStatus = this.setDelButonStatus.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleUploadDg = this.toggleUploadDg.bind(this);
    this.executeDel = this.executeDel.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);
    this.state = {
      forDeletion: [],
      delButtonStatus: true,
      downloadButtonStatus: true,
      showModal: false,
      showUploadDg: false,
    };
  }

  setDelButonStatus() {
    let status = true;
    if (this.state.forDeletion.length > 0) {
      status = false;
    }
    this.setState({ delButtonStatus: status });
  }

  executeDel() {
    this.props.executeDeletionQueue(this.state.forDeletion);
    this.toggleModal();
    this.setState({ forDeletion: [] });
  }

  handleFileUpload(file) {
    this.props.handleUploadedCSV(file);
  }


  handleDeletionQueue(record, status) {
    const deletelist = this.state.forDeletion;
    if (status) {
      if (deletelist.indexOf(record) === -1) {
          deletelist.push(record);
      }
    } else if (deletelist.indexOf(record) !== -1) {
          deletelist.splice(deletelist.indexOf(record), 1);
    }
    this.setState({ forDeletion: deletelist });
    this.setDelButonStatus();
  }

  toggleModal() {
       this.setState({ showModal: !this.state.showModal });
  }

  toggleUploadDg() {
       this.setState({ showUploadDg: !this.state.showUploadDg });
  }

  downloadCSV() {
    this.props.downloadCSV();
  }


    renderRows() {
        return this.props.data.map(resident =>
        <tr key={resident.id}>
          <td>
          <Cbox record={resident.id} handleDeletionQueue={this.handleDeletionQueue} />
          </td>
          <td>{resident.year}</td>
          <td>{resident.country}</td>
          <td>{resident.gender}</td>
          <td>{resident.family}&nbsp;</td>
          <td>{resident.children}</td>
          <td>{resident.eldership}</td>
          <td>{resident.street}</td>
        </tr>
      );
    }

    renderTable(loading) {
      const applyclass = (loading) ? 'disabled' : '';
      return (
        <div className={applyclass}>
        <Table striped hover>
        <thead>
          <tr>
            <th />
            <th>Gimimo<br />metai</th>
            <th>Gimimo<br />valstybė</th>
            <th>Lytis</th>
            <th>Šeimos<br />padėtis</th>
            <th>Vaikai</th>
            <th>Seniūnija</th>
            <th>Gatvė</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
        </Table>
        </div>
      );
    }

   render() {
     if ((this.props.total === 0) && (!this.props.loading)) {
       return (
         <h2>{this.props.notfound}</h2>
       );
     }

       return (
         <div>
           {this.renderTable(this.props.loading)}
           <ButtonToolbar>
             <Button
              ref={(input) => { this.ModalButton = input; }}
              bsStyle="danger"
              bsSize="xsmall"
              disabled={this.state.delButtonStatus}
              onClick={this.toggleModal}
             >
              <Glyphicon glyph="trash" /> Ištrinti pažymėtus
             </Button>
             <Button
              bsStyle="success"
              bsSize="xsmall"
              disabled={false}
              onClick={this.downloadCSV}
             >
              <Glyphicon glyph="download-alt" /> Atsisiųsti csv
             </Button>
             <UploadDialog
                handleCSVUpload={this.handleFileUpload}
             />
           </ButtonToolbar>
           <ModalConfirmation
              showModal={this.state.showModal}
              title="Ištrinti?"
              body="Ištrinti pasirinktus įrašus?"
              cancelLabel="Atsisakyti"
              confirmLabel="Ištrinti"
              count={`Pasirinkta įrašų: ${this.state.forDeletion.length}`}
              handleModalToggle={this.toggleModal}
              handleConfirmation={this.executeDel}
           />

         </div>
         );
      }
}

export default ResidentTable;
