import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import EmployeeAnalyzer from "./intern";

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={< EmployeeAnalyzer/>} />
       
      </Routes>
    </Router>
  );
}


export default App;
