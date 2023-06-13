import { Provider, Contract, constants } from "starknet";
import {
  Abi,
  ExtractAbiFunctionNames,
  FunctionArgs,
  FunctionRet,
} from "abi-wan-kanabi/kanabi";
import { abi } from "./abi";

class TypedContract<TAbi extends Abi> {
  abi: TAbi;
  inner: Contract;

  constructor(abi: TAbi, inner: Contract) {
    this.abi = abi;
    this.inner = inner;
  }

  async call<TFunctionName extends ExtractAbiFunctionNames<TAbi>>(
    method: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>
  ): Promise<FunctionRet<TAbi, TFunctionName>> {
    let args_array: any[];

    if (typeof args === undefined) {
      args_array = [];
    } else if (!Array.isArray(args)) {
      args_array = [args];
    } else {
      args_array = args;
    }

    return (await this.inner.call(
      method,
      args_array,
      undefined
    )) as FunctionRet<TAbi, TFunctionName>;
  }
}

async function main() {
  const provider = new Provider({
    sequencer: { network: constants.NetworkName.SN_GOERLI2 },
  });

  const testAddress =
    "0x01c6b2a993b335cabc12dd5fa39875f456f07f23b10dcbdf6529667a322bbda4";

  const { abi: testAbi } = await provider.getClassAt(testAddress);
  if (testAbi === undefined) {
    throw new Error("no abi.");
  }
  const myTestContract = new Contract(testAbi, testAddress, provider);

  // Copied from `starknet.js/__mocks__/cairo/helloSierra/hello.json`
  // We can't just use the `testAbi` we get above because need to add `as const`
  // for typescript to narrow the inferred types
  const myTypedContract = new TypedContract(abi, myTestContract);

  const bal = await myTypedContract.call("get_balance", []);

  console.log("Typed Initial balance =", bal);

  const bal1 = await myTestContract.call("get_balance");
  console.log("Initial balance =", bal1);
}

main();
