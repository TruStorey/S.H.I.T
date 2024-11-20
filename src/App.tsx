import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/app/layout";
import HomePage from "@/pages/HomePage";
import TransformList from "@/pages/TransformList";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/transform-list" element={<TransformList />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
