import React from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import { Router } from "./components/Router";
import "./index.css";

import { CeramicProvider, Networks } from "use-ceramic";
import {
  AuthProvider,
  EthereumAuthProvider,
} from "@ceramicnetwork/blockchain-utils-linking";
import Web3 from "web3";

async function connect(): Promise<AuthProvider> {
  // @ts-expect-error
  const provider = window.ethereum;
  const web3 = new Web3(provider);
  const accounts = await web3.eth.getAccounts();
  return new EthereumAuthProvider(provider, accounts[0]);
}

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider
      appId={process.env.REACT_APP_MORALIS_ID!}
      serverUrl={process.env.REACT_APP_MORALIS_SERVER!}
    >
      <CeramicProvider network={Networks.MAINNET} connect={connect}>
        <Router />
      </CeramicProvider>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
