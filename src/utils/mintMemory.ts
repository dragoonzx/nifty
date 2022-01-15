import Web3 from "web3";
import { AbiItem } from "web3-utils";
import SignableERC721 from "../abis/SignableERC721.json";
import NiftyMemories from "../abis/NiftyMemories.json";
import { store } from "../state";

export const mintMemory = async () => {
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
      .accounts(userAddress)
      .call();

    console.log(ercContractAddress);

    if (ercContractAddress === "0x0000000000000000000000000000000000000000") {
      ercContractAddress = await niftyMemoriesContract.methods
        .createAccount()
        .send({
          from: userAddress,
        });
    }
    console.log(ercContractAddress);

    const signableERC721Contract = new web3.eth.Contract(
      SignableERC721 as AbiItem[],
      ercContractAddress,
      {
        from: userAddress,
      }
    );

    const tx = await signableERC721Contract.methods.safeMintPublicSign(0).send({
      from: userAddress,
    });

    return tx;
  } catch (err) {
    console.error(err);
  }
};
