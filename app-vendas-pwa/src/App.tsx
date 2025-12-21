import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Ranking from "./pages/Ranking";
import Produtos from "./pages/Produtos";
import Ideias from "./pages/Ideias";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="ranking" element={<Ranking />} />
        <Route path="produtos" element={<Produtos />} />
        <Route path="ideias" element={<Ideias />} />
      </Route>
    </Routes>
  );
}

export default App;
