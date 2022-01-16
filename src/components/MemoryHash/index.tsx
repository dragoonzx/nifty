import React, { useEffect, useState } from "react";
import AppHeader from "../AppHeader";
import Post from "../Post";
import { useParams } from "react-router-dom";
import Moralis from "moralis";
import { useMoralis } from "react-moralis";
import { signMemory } from "../../utils/signMemory";
import { store } from "../../state";
import { useSnapshot } from "valtio";
import { NetworkAlert } from "../NetworkAlert/NetworkAlert";
import { toast } from "react-toastify";
import successImg from "../../assets/images/congrats.png";

interface IPostData {
  creator: string;
  title: string;
  img: string;
  tokenId: string;
  signers: string[];
}

const MemoryHash = () => {
  const storeSnap = useSnapshot(store);
  const { isInitializing, isInitialized, authenticate } = useMoralis();
  const { hash } = useParams<{ hash: string }>();

  const [postData, setPostData] = useState<IPostData>({
    creator: "",
    title: "",
    img: "",
    tokenId: "",
    signers: [],
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
      const tokenId = memory.get("memoryToken");
      const signers = memory.get("signees") ?? [];
      setPostData({
        creator,
        title,
        img,
        tokenId,
        signers,
      });
    };

    retrieveMemory();
  }, [isInitialized]);

  const [success, setSuccess] = useState(false);

  const signMemoryHash = async () => {
    if (!store.user) {
      return;
    }
    console.log(postData);

    try {
      const tx = await signMemory(postData.creator, postData.tokenId);
      const query = new Moralis.Query("Memories");
      query.equalTo("memoryHash", hash);
      const [memory] = await query.find();
      memory.addUnique("signees", store.user?.get("ethAddress"));
      await memory.save();
      console.log(tx);
      setSuccess(true);
      toast.success("You signed memory!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <AppHeader />
      <div className="container mx-auto sticky top-24 bg-white/30 text-center backdrop-blur-sm">
        <NetworkAlert />
      </div>
      <div
        className="container mx-auto text-center mt-4"
        style={{ maxWidth: "600px" }}
      >
        <h1 className="text-xl font-bold">
          You was invited to sign this memory!
        </h1>
        {!success && <p>hurry up, you have only 1 day to do it</p>}
        {success ? (
          <>
            <img
              src={successImg}
              className="h-20 flex justify-center text-center mx-auto"
              alt=""
            />
            <p className="font-bold">Successfully signed</p>
          </>
        ) : !storeSnap.user ? (
          <>
            <p className="mt-2">You should connect wallet to sign memory</p>
            <button onClick={() => authenticate()} className="btn my-2">
              Connect wallet
            </button>
            <p>or you can see instructions how to do this:</p>
            <p>
              <a href="https://metamask.io/" className="link" target="_blank">
                MetaMask instructions
              </a>{" "}
              and refresh this page
            </p>
          </>
        ) : (
          <button onClick={signMemoryHash} className="btn my-2">
            Sign memory
          </button>
        )}
      </div>
      <Post data={postData} />
    </div>
  );
};

export default MemoryHash;
