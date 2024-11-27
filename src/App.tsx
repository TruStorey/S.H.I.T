import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/app/layout";
import HomePage from "@/pages/HomePage";
import TransformList from "@/pages/TransformList";
import DateTimeConverter from "@/pages/DateTimeConverter";
import ReverseProxyConfig from "@/pages/ReverseProxyConfig";
import SubnetCalculator from "@/pages/SubnetCalculator";
import Base64Converter from "@/pages/Base64Converter";
import CertChecker from "@/pages/CertChecker";
import SSHKeyGenerator from "@/pages/SSHKeyGenerator";
import BoilerPlate from "@/pages/BoilerPlate";
import Links from "@/pages/Links";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/transform-list" element={<TransformList />} />
          <Route path="/date-time-converter" element={<DateTimeConverter />} />
          <Route path="/reverse-proxy-config" element={<ReverseProxyConfig />} />
          <Route path="/subnet-calculator" element={<SubnetCalculator />} />
          <Route path="/base64-converter" element={<Base64Converter />} />
          <Route path="/certificate-checker" element={<CertChecker />} />
          <Route path="/ssh-key-generator" element={<SSHKeyGenerator />} />
          <Route path="/links" element={<Links />} />
          <Route path="/boilerplate" element={<BoilerPlate />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
