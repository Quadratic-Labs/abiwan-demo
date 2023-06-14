import { Provider, Contract, constants, buildDefault } from "starknet";
import {
  Abi,
  ExtractAbiFunctionNames,
  FunctionArgs,
  FunctionRet,
  ContractFunctions,
} from "abi-wan-kanabi/kanabi";
import { abi } from "./abi";

type TypedCall<TAbi extends Abi> = {
  call<TFunctionName extends ExtractAbiFunctionNames<TAbi>>(
    method: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>
  ): Promise<FunctionRet<TAbi, TFunctionName>>;
};

type TypedContract<TAbi extends Abi> = TypedCall<TAbi> &
  ContractFunctions<TAbi>;

function createTypedContract<TAbi extends Abi>(
  contract: Contract
): TypedContract<TAbi> {
  const typedContract = {
    async call<TFunctionName extends ExtractAbiFunctionNames<TAbi>>(
      method: TFunctionName,
      args?: FunctionArgs<TAbi, TFunctionName>
    ): Promise<FunctionRet<TAbi, TFunctionName>> {
      const args_array: any[] =
        args === undefined ? [] : Array.isArray(args) ? args : [args];
      return (await contract.call(
        method,
        args_array,
        undefined
      )) as FunctionRet<TAbi, TFunctionName>;
    },
  } as TypedContract<TAbi>;

  contract.abi.forEach((abiElement) => {
    if (abiElement.type === "function") {
      Object.defineProperty(typedContract, abiElement.name, {
        writable: true,
        value: buildDefault(contract, abiElement),
      });
    }
  });

  return typedContract;
}

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
  const myTypedContract = createTypedContract<typeof abi>(myTestContract);

  console.log(
    "Typed Initial balance =",
    await myTypedContract.call("get_balance", [])
  );
  console.log(
    "Typed Initial balance meta-class =",
    await myTypedContract.get_balance()
  );
  console.log("Typed get_status =", await myTypedContract.get_status());
  console.log("Initial balance =", await myTestContract.call("get_balance"));
  console.log(
    "Initial balance meta-class =",
    await myTestContract.get_balance()
  );
}

main();
