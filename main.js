import React from 'react';
import ReactDOM from 'react-dom';
import { Col } from 'react-bootstrap';
import Header from './src/components/Header';
import Footer from './src/components/Footer';
import ResidentList from './src/components/ResidentList';

const App = () => (
  <Col md={8} mdOffset={2}>
        <Header headerText='Gyventojų skaičius Vilniaus m. savivaldybėse' />
        <ResidentList apiUrl='http://127.0.0.1:8000' />
        <Footer footerText='&copy; Vikis Satkevičius, 2017' />
  </Col>
  );

ReactDOM.render(<App />, document.getElementById('app'));
