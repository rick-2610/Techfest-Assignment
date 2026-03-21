import './App.css';
import React, { useState, useEffect, lazy, Suspense } from "react";
import { AuthContextProvider } from "./context/AuthContext.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import TopNavbar from './components/TopNavbar/TopNavbar.jsx';
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.jsx";

import Profile from "./pages/Profile/Profile";
import Projects from "./pages/Projects/Projects";
import ProjectsInternal from "./pages/Projects/ProjectsInternal";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";


function App() {

  
  return (
      <Router>
        <AuthContextProvider>
          <ScrollToTop />
          <TopNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects/:id" element={<ProjectsInternal />} />
          </Routes>
        </AuthContextProvider>
      </Router>
    );
  }  

export default App;
