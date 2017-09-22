import React, { Component } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import axios from 'axios';
import qs from 'qs';
import FilterSelector from './FilterSelector';
import PaginationSelector from './PaginationSelector';
import SortSelector from './SortSelector';
import StatusMessage from './StatusMessage';
import AutosuggestFilter from './AutosuggestFilter';

//import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class ResidentList extends Component {
  constructor(props) {
  super(props);
  this.handleSortChange = this.handleSortChange.bind(this);
  this.handleFilterChange = this.handleFilterChange.bind(this);
  this.handlePaginationChange = this.handlePaginationChange.bind(this);
  this.handleStartpageChange = this.handleStartpageChange.bind(this);
  this.handleSuggestChange = this.handleSuggestChange.bind(this);
  this.state = {
    residents: [],
    filter: 'default',
    from: '0',
    count: '10',
    sort: 'id:ASC',
    sortlabel: 'Rūšiavimas',
    status: 'Pasirinkite filtrą',
    total: 0,
    sortoptions: {
      'id:ASC': 'Įprastinis rūšiavimas',
      'street:ASC': 'Gatvė didėjančiai',
      'street:DESC': 'Gatvė mažėjančiai',
      'children:ASC': 'Vaikai didėjančiai',
      'children:DESC': 'Vaikai mažėjančiai',
      'gender:ASC': 'Lytis',
    },
    userfilters: {
      default: 'Visi įrašai',
      'children:!g0': 'Turintys vaikų',
      'children:!g2': 'Turintys > 2 vaikų',
      'gender:V': 'Vyrai',
      'gender:M': 'Moterys',
    },
    paginationoptions: ['10', '20', '30', '40', '50', '100'],
    paginationlabel: '10 eil./psl.',
    activepage: 1,
  };
}
  componentWillMount() {
    this.readApiPost();
  }

  setFilter(value) {
    const current = this.state.filter;
    let newfilter = value;
    if (current.indexOf(':') !== -1) {
      newfilter = `${current},${value}`;
    }
    this.setState({ filter: newfilter }, () => {
    this.readApiPost();
    });
  }

  handleFilterChange(value) {
      this.setFilter(value);
  }

  handleSortChange(value) {
   this.setState({ sort: value }, () => {
    this.readApiPost();
    this.setState({ sortlabel: this.state.sortoptions[value] });
 });
  }

  handleSuggestChange(value) {
    this.setFilter(`street:${value}`);
  }

  handlePaginationChange(value) {
    const activepage = Math.ceil(this.state.from, 10) / parseInt(value - 1, 10);
   this.setState({ count: value }, () => {
   this.readApiPost();
   this.setState({ paginationlabel: `${value} eil./psl.` });
   this.setState({ activePage: Math.ceil(activepage) });
});
  }

  handleStartpageChange(value) {
    const fromrecord = parseInt(value - 1, 10) * parseInt(this.state.count, 10);
  this.setState({ from: fromrecord }, () => {
   this.readApiPost();
   this.setState({ activePage: value });
});
  }

readApi() {
  const axiosparams = {
        method: 'GET',
        url: `http://gatves.skdn.com/data/jsondump/${this.state.from}/${this.state.count}/${this.state.filter}/${this.state.sort}`,
        withCredentials: false,
        };
  axios(axiosparams)
  .then(response => this.setState({
    residents: response.data.data.results,
    total: response.data.data.count,
    status: `Rasta įrašų: ${response.data.data.count}`,
   }))
  .catch((error) => console.log('Fetch error: ', error));
}

readApiPost() {
  const axiosparams = {
        method: 'POST',
        url: 'http://gatves.skdn.com/data/jsonpost',
        withCredentials: false,
        data: qs.stringify({
          from: this.state.from,
          count: this.state.count,
          where: this.state.filter,
          order: this.state.sort,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        };
  axios(axiosparams)
  .then(response => this.setState({
    residents: response.data.data.results,
    total: response.data.data.count,
    status: `Rasta įrašų: ${response.data.data.count}`,
   }))
   .then(console.log(this.state.filter))
  .catch((error) => console.log('Fetch error: ', error));
}

renderRows() {
    return this.state.residents.map(resident =>
    <tr key={resident.id}>
      <td>{resident.id}</td>
      <td>{resident.year}</td>
      <td>{resident.country}</td>
      <td>{resident.gender}</td>
      <td>{resident.family}</td>
      <td>{resident.children}</td>
      <td>{resident.eldership}</td>
      <td>{resident.street}</td>
    </tr>
  );
}

renderPagination() {
  const totalpages = Math.ceil(parseInt(this.state.total, 10) / parseInt(this.state.count, 10));
  return (
    <Pagination
        prev
        next
        first
        last
        ellipsis
        boundaryLinks
        items={totalpages}
        maxButtons={7}
        activePage={this.state.activePage}
        onSelect={this.handleStartpageChange}
    />
  );
}


  render() {
      return (
        <div>

           <StatusMessage statusText={this.state.status} />

           <FilterSelector
               filters={this.state.userfilters}
               selected={this.state.selected}
               handleFilterChange={this.handleFilterChange}
           />

           <AutosuggestFilter
               placeholder="Įrašykite gatvę"
               handleSuggestChange={this.handleSuggestChange}
          />

           <SortSelector
               sorts={this.state.sortoptions}
               sortlabel={this.state.sortlabel}
               selected={this.state.selected}
               handleSortChange={this.handleSortChange}
           />

           <Table striped bordered condensed hover responsive>
   <thead>
     <tr>
       <th>#</th>
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
   <div>{this.renderPagination()}
   <PaginationSelector
       counts={this.state.paginationoptions}
       paginationlabel={this.state.paginationlabel}
       selected={this.state.selected}
       handlePaginationChange={this.handlePaginationChange}
   />
   </div>

        </div>
        );
     }


}

export default ResidentList;
