import React from 'react';
import ReactDOM from 'react-dom';
import Footer from './src/components/Footer';
import ResidentList from './src/components/ResidentList';

const App = () => (
  <div>
        <ResidentList />
        <Footer hrefText='http://vikis.skdn.com' footerText='Vikis Satkevičius' />
  </div>
  );

ReactDOM.render(<App />, document.getElementById('app'));
