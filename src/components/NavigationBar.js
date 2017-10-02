import React from 'react';
import { Navbar, Nav, NavItem, FormGroup } from 'react-bootstrap';
import ChildFilter from './ChildFilter';
import GenderFilter from './GenderFilter';
import SortSelector from './SortSelector';
import AutosuggestFilter from './AutosuggestFilter';

class NavigationBar extends React.Component {
  constructor(props) {
     super(props);
          this.state = {
       selected: ''
     };
   }

   render() {
     const {
        clearFilters, clearButtonState,
        childfilters, childfilterlabel, handleChildFilterChange,
        genderfilters, genderfilterlabel, handleGenderFilterChange,
        sortoptions, sortlabel, handleSortChange,
        handleSuggestChange, clearSuggest,
      } = this.props;

       return (
         <Navbar fixedTop inverse>
          <Navbar.Header>
            <Navbar.Brand onClick={clearFilters}>
             Vilniaus gyventojai
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem
               disabled={clearButtonState}
               onClick={clearFilters}
              >
                Išvalyti filtrus
              </NavItem>
              <ChildFilter
                 filters={childfilters}
                 childfilterlabel={childfilterlabel}
                 handleChildFilterChange={handleChildFilterChange}
              />
              <GenderFilter
                 filters={genderfilters}
                 genderfilterlabel={genderfilterlabel}
                 handleGenderFilterChange={handleGenderFilterChange}
              />
            </Nav>
            <SortSelector
                sorts={sortoptions}
                sortlabel={sortlabel}
                handleSortChange={handleSortChange}
            />
            <Navbar.Form>
              <FormGroup>
                <AutosuggestFilter
                    placeholder="Gatvė"
                    handleSuggestChange={handleSuggestChange}
                    clearSuggest={clearSuggest}
                />
              </FormGroup>
            </Navbar.Form>
          </Navbar.Collapse>
         </Navbar>
         );
      }
}

export default NavigationBar;
