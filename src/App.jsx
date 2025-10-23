import React from 'react';
import './style/App.css';
import Navbar from './components/Navbar/Navbar.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Footer from './components/Footer/Footer.jsx';
import MainContent from './components/MainContent/MainContent.jsx';

function App() {
  return (
    <div className="wrapper">
      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="content-wrapper">
        <MainContent />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
