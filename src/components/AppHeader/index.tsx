import classNames from "classnames";
import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import { store } from "../../state";
import avatarImg from "../../assets/images/avatar.png";
import polygon from "../../assets/images/polygon.svg";
import crown from "../../assets/images/crown.svg";

// const tabStyle = {
//   maxWidth: "600px",
//   marginLeft: "auto",
// };

const AppHeader = ({
  main = false,
  onFeedChange,
  feed = "main",
}: {
  main?: boolean;
  feed?: string;
  onFeedChange?: (feed: string) => void;
}) => {
  const { authenticate, isAuthenticated, isAuthenticating, user } =
    useMoralis();

  useEffect(() => {
    store.user = user;
  }, [user]);

  return (
    <div className="bg-white/30 text-center backdrop-blur-sm sticky top-0">
      <div className="flex items-center justify-between px-10 pt-6 pb-2">
        <Link to="/">
          <img className="h-16" src={logo} alt="" />
        </Link>
        {main && onFeedChange && (
          <div
            className="flex-1 px-2 mx-2 top-1/2 -translate-y-1/2"
            style={{ maxWidth: "487px" }}
          >
            <div className="items-stretch hidden lg:flex absolute top-1/2 -translate-y-1/2 items-center">
              <button
                onClick={() => onFeedChange("main")}
                className={classNames(
                  "btn btn-sm rounded-btn",
                  feed === "main" ? "btn-success" : ""
                )}
              >
                My feed
              </button>
              <button
                onClick={() => onFeedChange("group")}
                className={classNames(
                  "btn btn-ghost btn-sm rounded-btn ml-2",
                  feed === "group" ? "btn-success" : ""
                )}
              >
                Group feed
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center">
          <div
            data-tip="app working on polygon"
            className="tooltip tooltip-left tooltip-primary mr-4"
          >
            <img className="h-6" src={polygon} alt="" />
          </div>
          {!isAuthenticated ? (
            <button
              className={classNames(
                "btn btn-primary",
                isAuthenticating ? "loading" : ""
              )}
              onClick={() => authenticate()}
            >
              Connect wallet
            </button>
          ) : (
            <button className="btn btn-primary" disabled>
              Memory pro <img className="ml-1 -mr-1" src={crown} alt="" />{" "}
            </button>
          )}
          <div className="dropdown dropdown-end ml-4">
            <div tabIndex={0}>
              <div className="avatar cursor-pointer">
                <div className="w-16 h-16 border-2 border-black rounded-md">
                  <img src={avatarImg} alt="" />
                </div>
              </div>
            </div>
            {user && (
              <ul
                tabIndex={0}
                className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-60"
              >
                <li>
                  <Link to="/app/memory">My memories</Link>
                </li>
                <li>
                  <a>Pending invites</a>
                </li>
                <li>
                  <a>Friends</a>
                </li>
                <li>
                  <a>Edit</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
