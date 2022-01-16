import React from "react";
import { Link } from "react-router-dom";
import LandUpImg from "../../assets/images/land-up1.png";
import LandDownImg from "../../assets/images/land-down1.png";
import logo from "../../assets/images/logo.svg";

const imgStyles = {
  maxHeight: "600px",
  left: "50%",
  transform: "translateX(-50%)",
};

const downImgStyles = {
  ...imgStyles,
  maxHeight: "580px",
};

const Landing = () => {
  return (
    <div className="px-10 mx-auto relative h-screen overflow-hidden">
      <div>
        <div className="w-160 bg-white -z-10 h-screen absolute top-0 left-1/2 -translate-x-1/2"></div>
        <div className="flex justify-between mt-6">
          <span>
            <img className="h-16" src={logo} alt="" />
          </span>
          <Link to="/app">
            <button className="btn-land">Launch app</button>
          </Link>
        </div>
        <img
          src={LandUpImg}
          className="absolute -z-10 left-0 top-0"
          style={imgStyles}
          alt=""
        />
        <div
          className="max-w-160 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white/30 text-center backdrop-blur-sm rounded-md"
          style={{ top: "calc(50% - 14px)" }}
        >
          <div className="flex flex-col justify-center p-8 text-black">
            <h1 className="text-3xl font-bold rubik">Nifty Memories</h1>
            <p className="text-xl mt-2">
              A social platform with an endless feed showing people NFT
              activity. Capture your emotions in NFT and start a group, share
              emotions with others!
            </p>
          </div>
        </div>
        <img
          src={LandDownImg}
          className="absolute -z-10 left-0 -bottom-2"
          style={downImgStyles}
          alt=""
        />
      </div>
    </div>
  );
};

export default Landing;
