import React from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';

class AutosuggestFilter extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);

    this.state = {
      value: '',
      suggestions: [],
      streets: []
    };
  }

componentWillMount() {
    this.readStreets();
  }

  componentWillReceiveProps() {
    if (this.props.clearSuggest() === 'clear') {
      this.setState({ value: '' });
    }
  }

escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


readStreets() {
    const axiosparams = {
          method: 'POST',
          url: 'http://gatves.skdn.com/data/allstreetdump',
          withCredentials: false,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          };
    axios(axiosparams)
    .then(response => this.setState({
      streets: response.data.streets,
     }))
    .catch((error) => console.log('Fetch error: ', error));
  }

onChange(event, { newValue }) {
  this.setState({ value: newValue });
  }

  getSuggestions(value) {
    const escapedValue = this.escapeRegexCharacters(value.trim());
    const streets = this.state.streets;
    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp(escapedValue, 'i');
    return streets.filter(street => regex.test(street.street));
  }

  onSuggestionsFetchRequested(value) {
 this.setState({
     suggestions: this.getSuggestions(value.value)
 });
 }


  onSuggestionsClearRequested() {
    this.setState({
     suggestions: []
   });
  }

  getSuggestionValue(suggestion) {
    return suggestion.street;
  }

  onSuggestionSelected(event, { suggestionValue }) {
    this.props.handleSuggestChange(suggestionValue);
  }


  renderSuggestion(suggestion) {
    return (
      <span>{suggestion.street}</span>
      );
  }

shouldRenderSuggestions(value) {
  return value.trim().length > 2;
}


   render() {
     const { value, suggestions } = this.state;
     const inputProps = {
       placeholder: this.props.placeholder,
       value,
       onChange: this.onChange
     };

      return (<Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
        onSuggestionSelected={this.onSuggestionSelected}
      />
      );
   }
}


export default AutosuggestFilter;
