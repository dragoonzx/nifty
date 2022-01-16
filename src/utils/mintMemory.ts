import Web3 from "web3";
import { AbiItem } from "web3-utils";
import SignableERC721 from "../abis/SignableERC721.json";
import NiftyMemories from "../abis/NiftyMemories.json";
import { store } from "../state";
import { toast } from "react-toastify";

export const mintMemory = async (signersList: string) => {
  let signers: string[] = [];
  if (signersList) {
    signers = signersList.split(",");
  }
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
    console.log(userAddress);

    let ercContractAddress = await niftyMemoriesContract.methods
      .accounts(userAddress)
      .call();

    console.log(ercContractAddress);

    if (ercContractAddress === "0x0000000000000000000000000000000000000000") {
      await niftyMemoriesContract.methods.createAccount().send({
        from: userAddress,
      });
      ercContractAddress = await niftyMemoriesContract.methods
        .accounts(userAddress)
        .call();
    }

    const signableERC721Contract = new web3.eth.Contract(
      SignableERC721 as AbiItem[],
      ercContractAddress,
      {
        from: userAddress,
      }
    );

    let tx;
    if (signers.length === 0) {
      tx = await signableERC721Contract.methods.safeMintPublicSign(86400).send({
        from: userAddress,
      });
    } else {
      tx = await signableERC721Contract.methods
        .safeMintPrivateSign(86400, signers)
        .send({
          from: userAddress,
        });
    }

    return tx;
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};
