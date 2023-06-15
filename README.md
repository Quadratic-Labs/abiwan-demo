# abiwan-demo

How to use abiwan for typechecking and autocompleting starknet.js contract calls

# Usage

You only need to cast the starknet.js `Contract` to a `TypedContract<typeof abi>` and typechecking is on for all your contract function calls wether you're using the `call` method or calling the functions by their name

You can find a working example in the file [`example.ts`](./example.ts), you can run it with `npm run example` after installing the dependencies with `npm install`

###  Usage Example:

```typescript
import { Provider, Contract, constants } from "starknet";
import { TypedContract } from "abi-wan-kanabi";

const provider = new Provider({
    sequencer: { network: constants.NetworkName.SN_GOERLI2 },
});

// It should be a const for Typescript to narrow the types
const abi = [
    // YOUR ABI HERE
] as const;

const testAddress = "0x01c6b2a993b335cabc12dd5fa39875f456f07f23b10dcbdf6529667a322bbda4";
const { abi: testAbi } = await provider.getClassAt(testAddress);
const contract = new Contract(testAbi, testAddress, provider) as Contract & TypedContract<typeof abi>;

const balance = await contract.get_balance()
//                             ^
//                             |
//                             (property) get_balance: () => Promise<bigint>
// If you hover over the get_balance function in VSCode, you'll see the correct
// signature inferred
```

Enjoy !
