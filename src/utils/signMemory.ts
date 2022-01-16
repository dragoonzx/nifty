import Web3 from "web3";
import { AbiItem } from "web3-utils";
import SignableERC721 from "../abis/SignableERC721.json";
import NiftyMemories from "../abis/NiftyMemories.json";
import { store } from "../state";
import { toast } from "react-toastify";

export const signMemory = async (creatorAddr: string, memoryToken: string) => {
  const contractAddress = "0x1Dd72f9BB1cf05a6F421B31990773fA5aCd6AD51";

  //@ts-expect-error
  const provider = window.ethereum;
  const web3 = new Web3(provider);
  const userAddress = store.user?.get("ethAddress");

  try {
    const niftyMemoriesContract = new web3.eth.Contract(
      NiftyMemories as AbiItem[],
      contractAddress
    );

    let ercContractAddress = await niftyMemoriesContract.methods
      .accounts(creatorAddr)
      .call();

    console.log(ercContractAddress);

    const signableERC721Contract = new web3.eth.Contract(
      SignableERC721 as AbiItem[],
      ercContractAddress,
      {
        from: userAddress,
      }
    );
    console.log(memoryToken);

    const tx = await signableERC721Contract.methods
      .signToken(Number(memoryToken))
      .send({
        from: userAddress,
      });

    return tx;
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};
