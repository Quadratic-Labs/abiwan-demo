import { Provider, Contract, constants } from "starknet";
import {
  Abi,
  TypedContract
} from "abi-wan-kanabi";
import { abi } from "./abi";

async function main() {
  const provider = new Provider({
    sequencer: { network: constants.NetworkName.SN_GOERLI2 },
  });

  const testAddress =
    "0x01c6b2a993b335cabc12dd5fa39875f456f07f23b10dcbdf6529667a322bbda4";
  const { abi: testAbi } = await provider.getClassAt(testAddress);

  if (testAbi === undefined) {
    throw new Error("No ABI.");
  }

  const myTestContract = new Contract(testAbi, testAddress, provider);
  const myTypedContract = myTestContract as TypedContract<typeof abi> & Contract;

  console.log("get_balance =", await myTestContract.call("get_balance"));
  console.log("get_balance meta-class =", await myTestContract.get_balance());
  console.log(
    "array2d_array meta-class =",
    await myTestContract.array2d_array([[1n, 2n], [3n, 4n]])
  );

  console.log(
    "Typed get_balance =",
    await myTypedContract.call("get_balance")
  );
  console.log(
    "Typed get_balance meta-class =",
    await myTypedContract.get_balance()
  );
  console.log("Typed get_status =", await myTypedContract.get_status());
  console.log(
    "Typed array2d_array =",
    await myTypedContract.array2d_array([[1n, 2n], [3n, 4n]])
  );
}

main();
