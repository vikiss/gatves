import React, { Component } from 'react';
import { Row, Col, Navbar, Nav, NavItem, FormGroup } from 'react-bootstrap';
import axios from 'axios';
import qs from 'qs';
import { Base64 } from 'js-base64';
import ResidentTable from './ResidentTable';
import ChildFilter from './ChildFilter';
import GenderFilter from './GenderFilter';
import PaginationSelector from './PaginationSelector';
import PaginationStrip from './PaginationStrip';
import SortSelector from './SortSelector';
import StatusMessage from './StatusMessage';
import AutosuggestFilter from './AutosuggestFilter';

class ResidentList extends Component {
  constructor(props) {
  super(props);
  this.handleSortChange = this.handleSortChange.bind(this);
  this.clearFilters = this.clearFilters.bind(this);
  this.handleChildFilterChange = this.handleChildFilterChange.bind(this);
  this.handleGenderFilterChange = this.handleGenderFilterChange.bind(this);
  this.handlePaginationChange = this.handlePaginationChange.bind(this);
  this.handlePageChange = this.handlePageChange.bind(this);
  this.handleSuggestChange = this.handleSuggestChange.bind(this);
  this.clearSuggest = this.clearSuggest.bind(this);
  this.executeDeletionQueue = this.executeDeletionQueue.bind(this);
  this.downloadCSV = this.downloadCSV.bind(this);
  this.handleUploadedCSV = this.handleUploadedCSV.bind(this);

  this.state = {
    residents: [],
    filter: [],
    from: '0',
    count: '10',
    sort: 'id:ASC',
    sortlabel: 'Rūšiavimas',
    childfilterlabel: 'Vaikų skaičius',
    genderfilterlabel: 'Lytis',
    status: 'Pasirinkite filtrą',
    total: 0,
    sortoptions: {
      'id:ASC': 'Įprastinis rūšiavimas',
      'street:ASC': 'Gatvė didėjančiai',
      'street:DESC': 'Gatvė mažėjančiai',
      'children:ASC': 'Vaikai didėjančiai',
      'children:DESC': 'Vaikai mažėjančiai',
      'gender:ASC': 'Lytis',
      'year:ASC': 'Gimimo metai didėjančiai',
      'year:DESC': 'Gimimo metai mažėjančiai',
    },
    userfilters: {
      default: 'Visi įrašai',
      'children:!g0': 'Turintys vaikų',
      'children:!g2': 'Turintys > 2 vaikų',
      'gender:V': 'Vyrai',
      'gender:M': 'Moterys',
    },
    genderfilters: {
      'gender:V': 'Vyrai',
      'gender:M': 'Moterys',
    },
    childfilters: {
      'children:0': 'Neturintys vaikų',
      'children:!g0': 'Turintys vaikų',
      'children:1': 'Turintys 1 vaiką',
      'children:2': 'Turintys 2 vaikus',
      'children:!g2': 'Turintys > 2 vaikus',
    },
    paginationoptions: ['10', '20', '30', '40', '50', '100'],
    paginationlabel: '10 eil./psl.',
    activePage: 1,
    activeStreet: 'initial',
    clearButtonState: true,
    downloadButtonStatus: true,
    loading: false,
    forDeletion: [],
    statusShown: true,
  };
}
  componentDidMount() {
    this.readApiPost();
  }

setFilter(value) {
let newfilter = this.state.filter;
let i = 0;
//which field are we filtering by
const field = (value.indexOf(':') === -1) ? '' : value.split(':')[0];
// if this filter set already contains this field we remove it
for (i = newfilter.length - 1; i >= 0; --i) {
  if (newfilter[i].split(':')[0] === field) {
    newfilter.splice(i, 1);
  }
}

if (value === 'default') {
  newfilter = [];
  this.setState({
    activeStreet: 'clear',
    childfilterlabel: 'Vaikų skaičius',
    genderfilterlabel: 'Lytis',
    clearButtonState: true,
    sort: 'id:ASC',
    sortlabel: 'Rūšiavimas',
    downloadButtonStatus: true,
    from: 0,
    activePage: 1,
   });
} else {
  newfilter.push(value);
  this.setState({
    activeStreet: 'initial',
    clearButtonState: false,
    downloadButtonStatus: false,
    from: 0,
    activePage: 1,
  });
}
      this.setState({ filter: newfilter }, () => {
      this.readApiPost();
    });
}

 clearFilters() {
        this.setFilter('default');
    }

  handleChildFilterChange(value) {
    this.setFilter(value);
    this.setState({ childfilterlabel: this.state.childfilters[value] });
  }

  handleGenderFilterChange(value) {
    this.setFilter(value);
    this.setState({ genderfilterlabel: this.state.genderfilters[value] });
  }

  clearSuggest() {
return this.state.activeStreet;
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
   this.setState({
     count: value,
      paginationlabel: `${value} eil./psl.`,
      from: '0',
      activePage: 1,
    }, () => {
    this.readApiPost();
    });
  }


  handlePageChange(value) {
    const fromrecord = parseInt(value - 1, 10) * parseInt(this.state.count, 10);
  this.setState({ from: fromrecord }, () => {
   this.readApiPost();
   this.setState({ activePage: value });
});
  }

  executeDeletionQueue(value) {
    this.setState({ forDeletion: value }, () => {
      this.commitApiDelete();
         this.readApiPost();
    });
  }

  downloadCSV() {
    const filter = this.state.filter.length === 0 ? 'default' : this.state.filter.join();
    const urlparams = {
      from: this.state.from,
      count: this.state.count,
      where: filter,
      order: this.state.sort,
    };
    window.location.href = `http://gatves.skdn.com/data/downloadCSV/${Base64.encode(JSON.stringify(urlparams))}`;
  }

handleUploadedCSV(file) {
  const axiosparams = {
        method: 'POST',
        url: 'http://gatves.skdn.com/data/insertrecords',
        withCredentials: false,
        data: qs.stringify({
          contents: Base64.encode(file),
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        };
  this.setState({ loading: true });
  axios(axiosparams)
  .then(response => this.setState({
    status: `Įterpta naujų įrašų: ${response.data.data.inserted}. Rasta pasikartojančių įrašų: ${response.data.data.duplicate}.`,
    statusShown: false,
  }, () => { this.readApiPost(); }
))
  .catch((error) => console.log('CSV upload fetch error: ', error));
}

readApiPost() {
  const filter = this.state.filter.length === 0 ? 'default' : this.state.filter.join();
  const axiosparams = {
        method: 'POST',
        url: 'http://gatves.skdn.com/data/jsonpost',
        withCredentials: false,
        data: qs.stringify({
          from: this.state.from,
          count: this.state.count,
          where: filter,
          order: this.state.sort,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        };
  this.setState({ loading: true });
  axios(axiosparams)
  .then(response => this.setState({
    residents: response.data.data.results,
    total: response.data.data.count,
    loading: false,
  }, () => {
    this.updateStatus(`Rasta įrašų: ${response.data.data.count}`);
   }))
  .catch((error) => console.log('Read records fetch error: ', error));
}

updateStatus(message) {
    if (this.state.statusShown) {
    this.setState({
      status: message,
    });
  } else {
    this.setState({
      statusShown: true,
    });
  }
}

commitApiDelete() {
  const forDeletion = this.state.forDeletion;
  if (forDeletion.length > 0) {
  const axiosparams = {
        method: 'POST',
        url: 'http://gatves.skdn.com/data/removerecords',
        withCredentials: false,
        data: qs.stringify({
          action: 'delete',
          records: JSON.stringify(forDeletion),
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        };
  this.setState({ loading: true });
  axios(axiosparams)
  .then(response => this.setState({
    forDeletion: [],
    status: `Ištrinta įrašų: ${response.data.response.count}`,
    statusShown: false,
   }))
  .catch((error) => console.log('Fetch error: ', error));
  }
}


  render() {
      return (
        <div>
           <Navbar fixedTop inverse>
            <Navbar.Header>
              <Navbar.Brand onClick={this.clearFilters}>
               Vilniaus gyventojai
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                <NavItem
                 disabled={this.state.clearButtonState}
                 onClick={this.clearFilters}
                >
                  Išvalyti filtrus
                </NavItem>
                <ChildFilter
                   filters={this.state.childfilters}
                   selected={this.state.selected}
                   childfilterlabel={this.state.childfilterlabel}
                   handleChildFilterChange={this.handleChildFilterChange}
                />
                <GenderFilter
                   filters={this.state.genderfilters}
                   selected={this.state.selected}
                   genderfilterlabel={this.state.genderfilterlabel}
                   handleGenderFilterChange={this.handleGenderFilterChange}
                />
              </Nav>
              <SortSelector
                  sorts={this.state.sortoptions}
                  sortlabel={this.state.sortlabel}
                  selected={this.state.selected}
                  handleSortChange={this.handleSortChange}
              />
              <Navbar.Form>
                <FormGroup>
                  <AutosuggestFilter
                      placeholder="Gatvė"
                      handleSuggestChange={this.handleSuggestChange}
                      clearSuggest={this.clearSuggest}
                  />
                </FormGroup>
              </Navbar.Form>
            </Navbar.Collapse>
           </Navbar>

           <Row>
            <Col md={12}>
              <StatusMessage statusText={this.state.status} />
              <ResidentTable
                  total={this.state.total}
                  data={this.state.residents}
                  notfound='Rezultatų, atitinkančių šiuos kriterijus, nerasta.'
                  loading={this.state.loading}
                  executeDeletionQueue={this.executeDeletionQueue}
                  downloadCSV={this.downloadCSV}
                  handleUploadedCSV={this.handleUploadedCSV}
              />
            <div className="text-center">
              <PaginationStrip
                 total={Math.ceil(parseInt(this.state.total, 10) / parseInt(this.state.count, 10))}
                 activePage={this.state.activePage}
                 handlePageChange={this.handlePageChange}
              />
              <div className="pull-right my2">
                <PaginationSelector
                    counts={this.state.paginationoptions}
                    paginationlabel={this.state.paginationlabel}
                    selected={this.state.selected}
                    handlePaginationChange={this.handlePaginationChange}
                />
              </div>
            </div>
           </Col>
          </Row>
        </div>
        );
     }
}

export default ResidentList;
