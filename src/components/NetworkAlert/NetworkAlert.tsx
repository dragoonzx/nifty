import { useCallback, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { useLocation } from "react-router-dom";
import Web3 from "web3";

const POLYGON_TESTNET = 80001;

enum ALERT_STATUSES {
  "NETWORK",
}

const switchNetworkPolygon = async () => {
  // @ts-expect-error
  const web3 = new Web3(window.ethereum);

  try {
    // @ts-expect-error: request on string
    await web3.currentProvider!.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x13881" }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      try {
        // @ts-expect-error: request on string
        await web3.currentProvider!.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x13881",
              chainName: "Polygon Testnet Mumbai",
              rpcUrls: ["https://rpc-mumbai.matic.today"],
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18,
              },
              blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
            },
          ],
        });
      } catch (error: any) {
        alert(error.message);
      }
    }
  }
};

export const NetworkAlert = () => {
  const location = useLocation();
  const isAppPage = location.pathname?.includes("app");

  const { Moralis } = useMoralis();

  const isMetaMaskInstalled = () => {
    // @ts-expect-error
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  const [chainId, setChainId] = useState(0);

  const getNetwork = async (): Promise<number | null> => {
    if (isMetaMaskInstalled()) {
      // @ts-expect-error
      const web3 = new Web3(window.ethereum);
      const chainId = await web3.eth.getChainId();
      return chainId;
    }

    return null;
  };

  useEffect(() => {
    const initChainWatcher = async () => {
      const initChainId = await getNetwork();
      initChainId && setChainId(initChainId);

      // @ts-expect-error: Moralis not typed
      Moralis.onChainChanged((chainId: string) => {
        setChainId(Web3.utils.hexToNumber(chainId));
      });
    };

    initChainWatcher();
  }, []);

  const [alert, setAlert] = useState<
    typeof ALERT_STATUSES[keyof typeof ALERT_STATUSES] | null
  >(null);

  useEffect(() => {
    const checkAlerts = () => {
      switch (true) {
        case chainId && chainId !== POLYGON_TESTNET:
          setAlert(ALERT_STATUSES.NETWORK);
          break;
        case chainId === POLYGON_TESTNET:
          setAlert(null);
          break;
      }
    };

    checkAlerts();
  }, [chainId]);

  const getAlertText = useCallback(() => {
    if (alert !== null) {
      return {
        [ALERT_STATUSES.NETWORK]: `App network (Polygon Mumbai) doesn't match to network selected in wallet (network with id: ${chainId})`,
      }[alert];
    }
  }, [alert, chainId]);

  if (alert === null) {
    return null;
  }

  if (!isAppPage) {
    return null;
  }

  return (
    <div
      className="px-4"
      style={{
        borderRadius: "5px",
        border: "2px solid #f7485b",
      }}
    >
      <div className="alert alert-error">
        <div className="flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-6 h-6 mx-2 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
          <label>{getAlertText()}</label>
        </div>
        <div className="flex-none">
          {alert === ALERT_STATUSES.NETWORK && (
            <button
              onClick={switchNetworkPolygon}
              className="btn btn-sm btn-primary"
            >
              Change network
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
