import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/app/layout";
import HomePage from "@/pages/HomePage";
import TransformList from "@/pages/TransformList";
import DateTimeConverter from "@/pages/DateTimeConverter";
import SubnetCalculator from "@/pages/SubnetCalculator";
import Base64Converter from "@/pages/Base64Converter";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/transform-list" element={<TransformList />} />
          <Route path="/date-time-converter" element={<DateTimeConverter />} />
          <Route path="/subnet-calculator" element={<SubnetCalculator />} />
          <Route path="/base64-converter" element={<Base64Converter />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
