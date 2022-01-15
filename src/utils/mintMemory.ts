import Web3 from "web3";
import { AbiItem } from "web3-utils";
import SignableERC721 from "../abis/SignableERC721.json";
import { store } from "../state";

export const mintMemory = async () => {
  const contractAddress = "0x1Dd72f9BB1cf05a6F421B31990773fA5aCd6AD51";

  //@ts-expect-error
  const provider = window.ethereum;
  const web3 = new Web3(provider);
  const userAddress = store.user?.get("ethAddress");

  try {
    const signableERC721Contract = new web3.eth.Contract(
      SignableERC721 as AbiItem[],
      contractAddress,
      {
        from: userAddress,
      }
    );

    const tx = await signableERC721Contract.methods
      .safeMintPublicSign("86400000")
      .send({
        from: userAddress,
      });

    return tx;
  } catch (err) {
    console.error(err);
  }
};
