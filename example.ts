import { Provider, Contract, constants } from "starknet";
import { Abi, TypedContract as AbiWanTypedContract } from "abi-wan-kanabi";
import { abi } from "./abi";

type TypedContract<TAbi extends Abi> = AbiWanTypedContract<TAbi> & Contract;

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

  const contract = new Contract(testAbi, testAddress, provider);
  const typedContract = contract as TypedContract<typeof abi>;

  console.log("get_balance =", await contract.call("get_balance"));
  console.log("get_balance meta-class =", await contract.get_balance());
  console.log(
    "array2d_array meta-class =",
    await contract.array2d_array([
      [1n, 2n],
      [3n, 4n],
    ])
  );

  console.log("Typed get_balance =", await typedContract.call("get_balance"));
  console.log(
    "Typed get_balance meta-class =",
    await typedContract.get_balance()
  );
  console.log("Typed get_status =", await typedContract.get_status());
  console.log(
    "Typed array2d_array =",
    await typedContract.array2d_array([
      [1n, 2n],
      [3n, 4n],
    ])
  );
}

main();
