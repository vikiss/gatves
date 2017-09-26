import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import Dropzone from 'react-dropzone';

class UploadDialog extends React.Component {
    constructor(props) {
      super(props);
      this.state = { files: [] };
    }

    onDrop(files) {
      this.setState({
        files
      });
      files.forEach(file => {
        if (file.size < 500000) {
          const reader = new FileReader();
          reader.onload = () => {
              const fileAsBinaryString = reader.result;
              this.props.handleCSVUpload(fileAsBinaryString);
          };
          reader.onabort = () => console.log('file reading was aborted');
          reader.onerror = () => console.log('file reading has failed');
          reader.readAsText(file);
        }
      });
    }

    render() {
      let dropzoneRef;
      return (
        <section className="inline ml1 pull-left">
        <Button
         bsStyle="warning"
         bsSize="xsmall"
         onClick={() => { dropzoneRef.open(); }}
        >
         <Glyphicon glyph="upload" /> Įkelti csv
        </Button>
          <div className="dropzone">
            <Dropzone ref={(node) => { dropzoneRef = node; }} onDrop={this.onDrop.bind(this)} />
          </div>
        </section>
      );
    }
  }

export default UploadDialog;
