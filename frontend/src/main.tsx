import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.tsx";
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <>
      <App />
    </>
  );
}
