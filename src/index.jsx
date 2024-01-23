import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import DetailedPost from "./component/detailedPost";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Renders App Component */}
        <Route path="/" element={<App />} />

        {/* Renders Detailed Post Component */}
        <Route path="/:id" element={<DetailedPost />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
