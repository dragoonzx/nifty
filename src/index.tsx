import React from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import { Router } from "./components/Router";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider
      appId={process.env.REACT_APP_MORALIS_ID!}
      serverUrl={process.env.REACT_APP_MORALIS_SERVER!}
    >
      <Router />
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
