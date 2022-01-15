import React, { useState, useEffect } from "react";
import Post from "../Post";
import QuickPost from "../QuickPost";
import { store } from "../../state";
import { useSnapshot } from "valtio";
import EmptyData from "../EmptyData";
import { useMoralis } from "react-moralis";
import Moralis from "moralis";

const Feed = () => {
  const storeSnap = useSnapshot(store);
  const { isInitializing, isInitialized } = useMoralis();
  const snapStore = useSnapshot(store);

  const [memories, setMemories] = useState<any>([]);

  useEffect(() => {
    // Retrieve file
    const retrieveMemories = async () => {
      if (!(isInitialized && store.user)) {
        return;
      }
      const query = new Moralis.Query("Memories");
      const results = await query.find();
      // const creator = memory.get("creator");
      // const title = memory.get("title");
      // const img = memory.get("memoryIpfs");
      // console.log(creator, title);
      const memo = results
        .map((res) => {
          return {
            creator: res.get("creator"),
            img: res.get("memoryIpfs"),
            title: res.get("title"),
            public: res.get("public"),
          };
        })
        .reverse();
      setMemories(memo);
    };

    retrieveMemories();
  }, [isInitialized, snapStore.user]);
  return (
    <div className="container mx-auto" style={{ maxWidth: "600px" }}>
      {storeSnap.user && <QuickPost />}
      {storeSnap.user ? (
        memories.map((post: any, id: number) => {
          return (
            <React.Fragment key={id}>
              {(post.public ||
                post.creator === storeSnap.user?.get("ethAddress")) && (
                <Post
                  data={{
                    creator: post.creator,
                    img: post.img,
                    title: post.title,
                  }}
                />
              )}
            </React.Fragment>
          );
        })
      ) : (
        <EmptyData />
      )}
    </div>
  );
};

export default Feed;
