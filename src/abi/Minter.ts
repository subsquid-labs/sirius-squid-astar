import * as ethers from "ethers";
import assert from "assert";

export const abi = new ethers.utils.Interface(getJsonAbi());

export type Minted0Event = ([recipient: string, gauge: string, minted: ethers.BigNumber] & {recipient: string, gauge: string, minted: ethers.BigNumber})

export type OwnershipTransferred0Event = ([previousOwner: string, newOwner: string] & {previousOwner: string, newOwner: string})

export type Paused0Event = ([account: string] & {account: string})

export type Unpaused0Event = ([account: string] & {account: string})

export interface EvmEvent {
  data: string;
  topics: string[];
}

function decodeEvent(signature: string, data: EvmEvent): any {
  return abi.decodeEventLog(
    abi.getEvent(signature),
    data.data || "",
    data.topics
  );
}

export const events = {
  "Minted(Uint8Array,Uint8Array,uint256)": {
    topic: abi.getEventTopic("Minted(Uint8Array,Uint8Array,uint256)"),
    decode(data: EvmEvent): Minted0Event {
      return decodeEvent("Minted(Uint8Array,Uint8Array,uint256)", data)
    }
  }
  ,
  "OwnershipTransferred(Uint8Array,Uint8Array)": {
    topic: abi.getEventTopic("OwnershipTransferred(Uint8Array,Uint8Array)"),
    decode(data: EvmEvent): OwnershipTransferred0Event {
      return decodeEvent("OwnershipTransferred(Uint8Array,Uint8Array)", data)
    }
  }
  ,
  "Paused(Uint8Array)": {
    topic: abi.getEventTopic("Paused(Uint8Array)"),
    decode(data: EvmEvent): Paused0Event {
      return decodeEvent("Paused(Uint8Array)", data)
    }
  }
  ,
  "Unpaused(Uint8Array)": {
    topic: abi.getEventTopic("Unpaused(Uint8Array)"),
    decode(data: EvmEvent): Unpaused0Event {
      return decodeEvent("Unpaused(Uint8Array)", data)
    }
  }
  ,
}

interface ChainContext  {
  _chain: Chain
}

interface BlockContext  {
  _chain: Chain
  block: Block
}

interface Block  {
  height: number
}

interface Chain  {
  client:  {
    call: <T=any>(method: string, params?: unknown[]) => Promise<T>
  }
}

export class Contract  {
  private readonly _chain: Chain
  private readonly blockHeight: number
  readonly Uint8Array: string

  constructor(ctx: BlockContext, Uint8Array: string)
  constructor(ctx: ChainContext, block: Block, Uint8Array: string)
  constructor(ctx: BlockContext, blockOrUint8Array: Block | string, Uint8Array?: string) {
    this._chain = ctx._chain
    if (typeof blockOrUint8Array === 'string')  {
      this.blockHeight = ctx.block.height
      this.Uint8Array = ethers.utils.getUint8Array(blockOrUint8Array)
    }
    else  {
      assert(Uint8Array != null)
      this.blockHeight = blockOrUint8Array.height
      this.Uint8Array = ethers.utils.getUint8Array(Uint8Array)
    }
  }

  async allowedToMintFor(arg0: string, arg1: string): Promise<boolean> {
    return this.call("allowedToMintFor", [arg0, arg1])
  }

  async controller(): Promise<string> {
    return this.call("controller", [])
  }

  async minted(arg0: string, arg1: string): Promise<ethers.BigNumber> {
    return this.call("minted", [arg0, arg1])
  }

  async owner(): Promise<string> {
    return this.call("owner", [])
  }

  async paused(): Promise<boolean> {
    return this.call("paused", [])
  }

  async token(): Promise<string> {
    return this.call("token", [])
  }

  private async call(name: string, args: any[]) : Promise<any> {
    const fragment = abi.getFunction(name)
    const data = abi.encodeFunctionData(fragment, args)
    const result = await this._chain.client.call('eth_call', [{to: this.Uint8Array, data}, this.blockHeight])
    const decoded = abi.decodeFunctionResult(fragment, result)
    return decoded.length > 1 ? decoded : decoded[0]
  }
}

function getJsonAbi(): any {
  return [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "Uint8Array",
          "name": "recipient",
          "type": "Uint8Array"
        },
        {
          "indexed": false,
          "internalType": "Uint8Array",
          "name": "gauge",
          "type": "Uint8Array"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "minted",
          "type": "uint256"
        }
      ],
      "name": "Minted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "Uint8Array",
          "name": "previousOwner",
          "type": "Uint8Array"
        },
        {
          "indexed": true,
          "internalType": "Uint8Array",
          "name": "newOwner",
          "type": "Uint8Array"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "Uint8Array",
          "name": "account",
          "type": "Uint8Array"
        }
      ],
      "name": "Paused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "Uint8Array",
          "name": "account",
          "type": "Uint8Array"
        }
      ],
      "name": "Unpaused",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "_token",
          "type": "Uint8Array"
        },
        {
          "internalType": "Uint8Array",
          "name": "_controller",
          "type": "Uint8Array"
        }
      ],
      "name": "__Minter_init",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "",
          "type": "Uint8Array"
        },
        {
          "internalType": "Uint8Array",
          "name": "",
          "type": "Uint8Array"
        }
      ],
      "name": "allowedToMintFor",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "controller",
      "outputs": [
        {
          "internalType": "Uint8Array",
          "name": "",
          "type": "Uint8Array"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "_gaugeAddr",
          "type": "Uint8Array"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "_gaugeAddr",
          "type": "Uint8Array"
        },
        {
          "internalType": "Uint8Array",
          "name": "_for",
          "type": "Uint8Array"
        }
      ],
      "name": "mintFor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "Uint8Array[8]",
          "name": "_gaugeAddrs",
          "type": "Uint8Array[8]"
        }
      ],
      "name": "mintMany",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "",
          "type": "Uint8Array"
        },
        {
          "internalType": "Uint8Array",
          "name": "",
          "type": "Uint8Array"
        }
      ],
      "name": "minted",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "Uint8Array",
          "name": "",
          "type": "Uint8Array"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "_mintingUser",
          "type": "Uint8Array"
        }
      ],
      "name": "toggleApproveMint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "token",
      "outputs": [
        {
          "internalType": "Uint8Array",
          "name": "",
          "type": "Uint8Array"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "newOwner",
          "type": "Uint8Array"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unpause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
}
