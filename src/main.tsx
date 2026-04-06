import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { dieRollResultStore } from "./redux/dieRollStore.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={dieRollResultStore}>
      <App />
    </Provider>
  </StrictMode>,
);
