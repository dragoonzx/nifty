import classNames from "classnames";
import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import { store } from "../../state";
import avatarImg from "../../assets/images/avatar.png";

// const tabStyle = {
//   maxWidth: "600px",
//   marginLeft: "auto",
// };

const AppHeader = ({ main = false }: { main?: boolean }) => {
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
        {main && (
          <div
            className="flex-1 px-2 mx-2 top-1/2 -translate-y-1/2"
            style={{ maxWidth: "487px" }}
          >
            <div className="items-stretch hidden lg:flex absolute top-1/2 -translate-y-1/2 items-center">
              <a className="btn  btn-sm btn-success rounded-btn">My feed</a>
              <a className="btn btn-ghost btn-sm rounded-btn ml-2">
                Group feed
              </a>
            </div>
          </div>
        )}

        <div className="flex items-center">
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
            <button className="btn btn-primary">Memory pro 🐱</button>
          )}
          <div className="dropdown dropdown-end ml-4">
            <div tabIndex={0}>
              <div className="avatar cursor-pointer">
                <div className="w-16 h-16 border-2 border-black rounded-md">
                  <img src={avatarImg} alt="" />
                </div>
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
