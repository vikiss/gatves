import React, { Component } from 'react';
import axios from 'axios';
import TagSelector from './TagSelector';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class ResidentList extends Component {
  constructor(props) {
  super(props);
  this.handleTagChange = this.handleTagChange.bind(this);
  this.state = { residents: [], filter: '' };
}
  componentWillMount() {
    const axiosparams = {
          method: 'GET',
          url:  'http://gatves.skdn.com/data/jsondump/0/100/dedfault/street:ASC',
          withCredentials: false,
          };
    axios(axiosparams)
    .then(response => this.setState({ residents: response.data.data.results }))
    .catch((error) => console.log('Fetch error: ', error));

  }

  handleTagChange(value) {
   this.setState({ filter: value });
  }

  extractTagList() {
    /* retrieve a list of all tags used, raw comma-separated string first */
    const filteredTags = [];
    const rawTags = this.state.residents.map(
      project => project.tags
    );
    /* split tags and store them in an array */
     rawTags.map(
      element => {
        if (element) {
            element.split(',').map(
              singleElement => {
                if (filteredTags.indexOf(singleElement) === -1) {
                  filteredTags.push(singleElement);
                }
              return true;
              }
            );
          }
          return true;
       }
    );

  return filteredTags.sort((a, b) =>
   a.toLowerCase().localeCompare(b.toLowerCase())
  );
}


  render() {
      return (
        <div>
        
           <TagSelector
               tags={this.extractTagList()}
               selected={this.state.selected}
               handleTagChange={this.handleTagChange}
           />
           
             <BootstrapTable data={this.state.residents} striped={true} hover={true}>
      <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}>id</TableHeaderColumn>
      <TableHeaderColumn dataField="year" dataSort={true}>Gimimo metai</TableHeaderColumn>
      <TableHeaderColumn dataField="country" dataSort={true}>Gimimo valstybė</TableHeaderColumn>
      <TableHeaderColumn dataField="gender" dataSort={true}>Lytis</TableHeaderColumn>
      <TableHeaderColumn dataField="family" dataSort={true}>Šeimos padėtis</TableHeaderColumn>
      <TableHeaderColumn dataField="children" dataSort={true}>Vaikai</TableHeaderColumn>
      <TableHeaderColumn dataField="eldership" dataSort={true}>Seniūnija</TableHeaderColumn>
      <TableHeaderColumn dataField="street" dataSort={true}>Gatvė</TableHeaderColumn>
  </BootstrapTable>
        </div>
        );
     }


}

export default ResidentList;
