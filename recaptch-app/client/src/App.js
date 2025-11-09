import React from 'react';
import ContactForm from './components/ContactForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Contact Form with reCAPTCHA</h1>
        <p>Fill out the form below to get in touch</p>
      </header>
      <main className="App-main">
        <ContactForm />
      </main>
    </div>
  );
}

export default App;
