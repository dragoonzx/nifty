import React, { useEffect, useState } from "react";
import AppHeader from "../AppHeader";
import Post from "../Post";
import { useParams } from "react-router-dom";
import Moralis from "moralis";
import { useMoralis } from "react-moralis";

const MemoryHash = () => {
  const { isInitializing, isInitialized } = useMoralis();
  const { hash } = useParams<{ hash: string }>();

  const [postData, setPostData] = useState({
    creator: "",
    title: "",
    img: "",
  });

  useEffect(() => {
    // Retrieve file
    const retrieveMemory = async () => {
      if (!isInitialized) {
        return;
      }
      const query = new Moralis.Query("Memories");
      query.equalTo("memoryHash", hash);
      const [memory] = await query.find();
      const creator = memory.get("creator");
      const title = memory.get("title");
      const img = memory.get("memoryIpfs");
      console.log(creator, title);
      setPostData({
        creator,
        title,
        img,
      });
    };

    retrieveMemory();
  }, [isInitialized]);

  return (
    <div>
      <AppHeader />
      <div
        className="container mx-auto text-center"
        style={{ maxWidth: "600px" }}
      >
        <h1 className="text-xl font-bold">
          You was invited to sign this memory!
        </h1>
        <p className="mt-2">You should connect wallet to sign memory</p>
        <button className="btn my-2">Connect wallet</button>
        <p>or you can see instructions how to do this:</p>
        <p>
          <a href="https://metamask.io/" className="link" target="_blank">
            MetaMask instructions
          </a>{" "}
          and refresh this page
        </p>
      </div>
      <Post data={postData} />
    </div>
  );
};

export default MemoryHash;
