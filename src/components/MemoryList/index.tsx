import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import AppHeader from "../AppHeader";
import Moralis from "moralis";
import { store } from "../../state";
import { useSnapshot } from "valtio";

const MemoryList = () => {
  const { isInitializing, isInitialized } = useMoralis();
  const snapStore = useSnapshot(store);

  const [memories, setMemories] = useState<any>([]);
  const [signedMemories, setSignedMemories] = useState<any>([]);

  useEffect(() => {
    // Retrieve file
    const retrieveMemories = async () => {
      if (!(isInitialized && store.user)) {
        return;
      }
      const query = new Moralis.Query("Memories");
      // query.equalTo("creator", store.user.get("ethAddress"));
      const results = await query.find();
      // const creator = memory.get("creator");
      // const title = memory.get("title");
      // const img = memory.get("memoryIpfs");
      // console.log(creator, title);
      const memo = results
        .map((res) => {
          if (res.get("creator") !== store.user?.get("ethAddress")) {
            return null;
          }
          const signees = res.get("signees");

          return {
            img: res.get("memoryIpfs"),
            title: res.get("title"),
            public: res.get("public"),
            signees: signees ?? [],
          };
        })
        .filter(Boolean);

      const memoSigned = results
        .map((res) => {
          const signees = res.get("signees");
          if (!signees?.length) {
            return null;
          }
          if (signees.includes(store.user?.get("ethAddress"))) {
            return {
              img: res.get("memoryIpfs"),
              title: res.get("title"),
              public: res.get("public"),
              signees: signees,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      setMemories(memo);
      setSignedMemories(memoSigned);
    };

    retrieveMemories();
  }, [isInitialized, snapStore.user]);

  return (
    <div>
      <AppHeader />
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold">My memories</h2>
        <div className="flex flex-wrap -m-4 mt-8">
          {memories.map((post: any, id: number) => (
            <div key={id} className="lg:w-1/4 p-4 w-1/2">
              <a className="block relative h-48 rounded overflow-hidden">
                <img
                  alt=""
                  className="object-cover object-center w-full h-full block"
                  src={post.img}
                />
              </a>
              <div className="mt-4">
                <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                  {post.public ? "public" : "signers only"} ‧
                  <div className="dropdown">
                    <a tabIndex={0} className="link link-primary">
                      {post.signees.length} signers
                    </a>
                    <ul
                      tabIndex={0}
                      className="p-2 shadow menu dropdown-content bg-primary text-white rounded-box w-52"
                    >
                      {post.signees.map((v: string, i: number) => (
                        <li key={i}>
                          <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </h3>
                <h2 className="text-gray-900 title-font text-lg font-medium">
                  {post.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold mt-8">My signed memories</h2>

        <div className="flex flex-wrap -m-4 mt-8">
          {signedMemories.map((post: any, id: number) => (
            <div key={id} className="lg:w-1/4 p-4 w-1/2">
              <a className="block relative h-48 rounded overflow-hidden">
                <img
                  alt=""
                  className="object-cover object-center w-full h-full block"
                  src={post.img}
                />
              </a>
              <div className="mt-4">
                <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                  {post.public ? "public" : "signers only"} ‧{" "}
                  <div className="dropdown">
                    <a tabIndex={0} className="link link-primary">
                      {post.signees.length} signers
                    </a>
                    <ul
                      tabIndex={0}
                      className="p-2 shadow menu dropdown-content text-white bg-primary rounded-box w-52"
                    >
                      {post.signees.map((v: string, i: number) => (
                        <li key={i}>
                          <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </h3>
                <h2 className="text-gray-900 title-font text-lg font-medium">
                  {post.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemoryList;
