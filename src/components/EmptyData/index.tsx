import classNames from "classnames";
import React from "react";
import { useMoralis } from "react-moralis";
import success from "../../assets/images/congrats.png";

const EmptyData = () => {
  const { authenticate, isAuthenticated, isAuthenticating, user } =
    useMoralis();

  return (
    <div className="container flex flex-col md:flex-row items-center justify-center text-gray-700">
      <div className="max-w-md">
        <p className="text-2xl md:text-3xl font-light leading-normal">
          Please login with your wallet.{" "}
        </p>
        <p className="mt-2">
          To create memories and find out what your friends share you need to
          sign in.
        </p>
        <p className="mb-8 mt-2">
          Instructions how to do this:{" "}
          <p>
            <a href="https://metamask.io/" className="link" target="_blank">
              MetaMask instructions
            </a>{" "}
            and refresh this page after installation
          </p>
        </p>

        <button
          onClick={() => authenticate()}
          className={classNames(
            "btn text-sm font-medium leading-5 shadow",
            isAuthenticating ? "loading" : ""
          )}
        >
          Connect wallet
        </button>
      </div>
      <img className="h-16" src={success} alt="" />
    </div>
  );
};

export default EmptyData;
