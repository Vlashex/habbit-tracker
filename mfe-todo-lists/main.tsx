import React from "react";
import { createRoot } from "react-dom/client";
import Remote from "./app/bootstrap";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<Remote />);
}


