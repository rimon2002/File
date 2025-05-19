import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Updated import for React Router v6
import Signup from "./Signup";
import Login from "./Login";
import FileUpload from "./FileUpload";
import "./index.css";
const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<Signup />} />{" "}
          {/* Updated Route syntax */}
          <Route path="/login" element={<Login />} />{" "}
          {/* Updated Route syntax */}
          <Route path="/upload" element={<FileUpload />} />{" "}
          {/* Updated Route syntax */}
          <Route path="/" element={<Login />} /> {/* Default route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
