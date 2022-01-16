import React, { useState, useEffect } from "react";
import Post from "../Post";
import QuickPost from "../QuickPost";
import { store } from "../../state";
import { useSnapshot } from "valtio";
import EmptyData from "../EmptyData";
import { useMoralis } from "react-moralis";
import Moralis from "moralis";

const Feed = ({ feedType = "main" }: { feedType?: string }) => {
  const storeSnap = useSnapshot(store);
  const { isInitializing, isInitialized } = useMoralis();
  const snapStore = useSnapshot(store);

  const [memories, setMemories] = useState<any>([]);

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
          signers: res.get("signees") ?? [],
        };
      })
      .reverse();
    setMemories(memo);
  };

  useEffect(() => {
    // Retrieve
    retrieveMemories();
  }, [isInitialized, snapStore.user]);
  return (
    <div className="container mx-auto" style={{ maxWidth: "600px" }}>
      {storeSnap.user && <QuickPost onPostPublish={retrieveMemories} />}
      {storeSnap.user ? (
        feedType === "main" ? (
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
                      signers: post.signers,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })
        ) : (
          <div>
            <h1 className="text-xl font-bold">My groups</h1>
            <div className="mt-4">Devs do something...</div>
          </div>
        )
      ) : (
        <EmptyData />
      )}
    </div>
  );
};

export default Feed;
