import Web3 from "web3";
import { AbiItem } from "web3-utils";
import SignableERC721 from "../abis/SignableERC721.json";
import NiftyMemories from "../abis/NiftyMemories.json";
import { store } from "../state";
import { toast } from "react-toastify";
import { RelayProvider } from "@opengsn/provider";

export const signMemory = async (creatorAddr: string, memoryToken: string) => {
  const contractAddress = "0x1Dd72f9BB1cf05a6F421B31990773fA5aCd6AD51";

  const config = { 
    paymasterAddress: "0x5566b6DE069c8c60caD808E133f513AE9AD2Eb5a",
    //relayHubAddress: "0x79A1c9f5a05795aFc04bbACaE46275Ac01a11919",
    //stakeManagerAddress: "0x9D0060A21C048cF7b0Fa8Da997B78c4B211F39c8",
  }

  //@ts-expect-error
  const provider = window.ethereum;
  const GSNProvider = await RelayProvider.newProvider({provider, config }).init()

  const web3 = new Web3(GSNProvider);
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
