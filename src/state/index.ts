import { proxy } from "valtio";
import Moralis from "moralis";

interface IStore {
  user: Moralis.User<Moralis.Attributes> | null;
}

export const store: IStore = proxy({
  user: null,
});
