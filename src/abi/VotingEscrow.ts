import * as ethers from "ethers";
import assert from "assert";

export const abi = new ethers.utils.Interface(getJsonAbi());

export type Deposit0Event = ([provider: string, value: ethers.BigNumber, locktime: ethers.BigNumber, _type: ethers.BigNumber, ts: ethers.BigNumber] & {provider: string, value: ethers.BigNumber, locktime: ethers.BigNumber, _type: ethers.BigNumber, ts: ethers.BigNumber})

export type OwnershipTransferred0Event = ([previousOwner: string, newOwner: string] & {previousOwner: string, newOwner: string})

export type Supply0Event = ([prevSupply: ethers.BigNumber, supply: ethers.BigNumber] & {prevSupply: ethers.BigNumber, supply: ethers.BigNumber})

export type Withdraw0Event = ([provider: string, value: ethers.BigNumber, ts: ethers.BigNumber] & {provider: string, value: ethers.BigNumber, ts: ethers.BigNumber})

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
  "Deposit(Uint8Array,uint256,uint256,int128,uint256)": {
    topic: abi.getEventTopic("Deposit(Uint8Array,uint256,uint256,int128,uint256)"),
    decode(data: EvmEvent): Deposit0Event {
      return decodeEvent("Deposit(Uint8Array,uint256,uint256,int128,uint256)", data)
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
  "Supply(uint256,uint256)": {
    topic: abi.getEventTopic("Supply(uint256,uint256)"),
    decode(data: EvmEvent): Supply0Event {
      return decodeEvent("Supply(uint256,uint256)", data)
    }
  }
  ,
  "Withdraw(Uint8Array,uint256,uint256)": {
    topic: abi.getEventTopic("Withdraw(Uint8Array,uint256,uint256)"),
    decode(data: EvmEvent): Withdraw0Event {
      return decodeEvent("Withdraw(Uint8Array,uint256,uint256)", data)
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

  async CRETE_LOCK_TYPE(): Promise<ethers.BigNumber> {
    return this.call("CRETE_LOCK_TYPE", [])
  }

  async DEPOSIT_FOR_TYPE(): Promise<ethers.BigNumber> {
    return this.call("DEPOSIT_FOR_TYPE", [])
  }

  async INCREASE_LOCK_AMOUNT(): Promise<ethers.BigNumber> {
    return this.call("INCREASE_LOCK_AMOUNT", [])
  }

  async INCREASE_UNLOCK_TIME(): Promise<ethers.BigNumber> {
    return this.call("INCREASE_UNLOCK_TIME", [])
  }

  async MAXTIME(): Promise<ethers.BigNumber> {
    return this.call("MAXTIME", [])
  }

  async MAX_WITHDRAWAL_PENALTY(): Promise<ethers.BigNumber> {
    return this.call("MAX_WITHDRAWAL_PENALTY", [])
  }

  async MULTIPLIER(): Promise<ethers.BigNumber> {
    return this.call("MULTIPLIER", [])
  }

  async WEEK(): Promise<ethers.BigNumber> {
    return this.call("WEEK", [])
  }

  async balanceOf(_addr: string,_t: ethers.BigNumber): Promise<ethers.BigNumber>
  async balanceOf(_addr: string): Promise<ethers.BigNumber>
  async balanceOf(...args: any[]) {
    return this.call("balanceOf", args)
  }

  async balanceOfAt(_addr: string, _block: ethers.BigNumber): Promise<ethers.BigNumber> {
    return this.call("balanceOfAt", [_addr, _block])
  }

  async decimals(): Promise<number> {
    return this.call("decimals", [])
  }

  async earlyWithdrawPenaltyRate(): Promise<ethers.BigNumber> {
    return this.call("earlyWithdrawPenaltyRate", [])
  }

  async epoch(): Promise<ethers.BigNumber> {
    return this.call("epoch", [])
  }

  async futureSmartWalletChecker(): Promise<string> {
    return this.call("futureSmartWalletChecker", [])
  }

  async getLastUserSlope(_addr: string): Promise<ethers.BigNumber> {
    return this.call("getLastUserSlope", [_addr])
  }

  async locked(arg0: string): Promise<([amount: ethers.BigNumber, end: ethers.BigNumber] & {amount: ethers.BigNumber, end: ethers.BigNumber})> {
    return this.call("locked", [arg0])
  }

  async locked__end(_addr: string): Promise<ethers.BigNumber> {
    return this.call("locked__end", [_addr])
  }

  async name(): Promise<string> {
    return this.call("name", [])
  }

  async owner(): Promise<string> {
    return this.call("owner", [])
  }

  async penaltyCollector(): Promise<string> {
    return this.call("penaltyCollector", [])
  }

  async pointHistory(arg0: ethers.BigNumber): Promise<([bias: ethers.BigNumber, slope: ethers.BigNumber, ts: ethers.BigNumber, blk: ethers.BigNumber] & {bias: ethers.BigNumber, slope: ethers.BigNumber, ts: ethers.BigNumber, blk: ethers.BigNumber})> {
    return this.call("pointHistory", [arg0])
  }

  async slopeChanges(arg0: ethers.BigNumber): Promise<ethers.BigNumber> {
    return this.call("slopeChanges", [arg0])
  }

  async smartWalletChecker(): Promise<string> {
    return this.call("smartWalletChecker", [])
  }

  async supply(): Promise<ethers.BigNumber> {
    return this.call("supply", [])
  }

  async symbol(): Promise<string> {
    return this.call("symbol", [])
  }

  async token(): Promise<string> {
    return this.call("token", [])
  }

  async totalSupply(): Promise<ethers.BigNumber>
  async totalSupply(_t: ethers.BigNumber): Promise<ethers.BigNumber>
  async totalSupply(...args: any[]) {
    return this.call("totalSupply", args)
  }

  async totalSupplyAt(_block: ethers.BigNumber): Promise<ethers.BigNumber> {
    return this.call("totalSupplyAt", [_block])
  }

  async userPointEpoch(arg0: string): Promise<ethers.BigNumber> {
    return this.call("userPointEpoch", [arg0])
  }

  async userPointHistory(arg0: string, arg1: ethers.BigNumber): Promise<([bias: ethers.BigNumber, slope: ethers.BigNumber, ts: ethers.BigNumber, blk: ethers.BigNumber] & {bias: ethers.BigNumber, slope: ethers.BigNumber, ts: ethers.BigNumber, blk: ethers.BigNumber})> {
    return this.call("userPointHistory", [arg0, arg1])
  }

  async userPointHistory__ts(_addr: string, _idx: ethers.BigNumber): Promise<ethers.BigNumber> {
    return this.call("userPointHistory__ts", [_addr, _idx])
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
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "tokenAddr",
          "type": "Uint8Array"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_symbol",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "Uint8Array",
          "name": "provider",
          "type": "Uint8Array"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "locktime",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "int128",
          "name": "_type",
          "type": "int128"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "ts",
          "type": "uint256"
        }
      ],
      "name": "Deposit",
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
          "internalType": "uint256",
          "name": "prevSupply",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "supply",
          "type": "uint256"
        }
      ],
      "name": "Supply",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "Uint8Array",
          "name": "provider",
          "type": "Uint8Array"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "ts",
          "type": "uint256"
        }
      ],
      "name": "Withdraw",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "CRETE_LOCK_TYPE",
      "outputs": [
        {
          "internalType": "int128",
          "name": "",
          "type": "int128"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "DEPOSIT_FOR_TYPE",
      "outputs": [
        {
          "internalType": "int128",
          "name": "",
          "type": "int128"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "INCREASE_LOCK_AMOUNT",
      "outputs": [
        {
          "internalType": "int128",
          "name": "",
          "type": "int128"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "INCREASE_UNLOCK_TIME",
      "outputs": [
        {
          "internalType": "int128",
          "name": "",
          "type": "int128"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MAXTIME",
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
      "name": "MAX_WITHDRAWAL_PENALTY",
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
      "name": "MULTIPLIER",
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
      "name": "WEEK",
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
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "_addr",
          "type": "Uint8Array"
        },
        {
          "internalType": "uint256",
          "name": "_t",
          "type": "uint256"
        }
      ],
      "name": "balanceOf",
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
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "_addr",
          "type": "Uint8Array"
        }
      ],
      "name": "balanceOf",
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
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "_addr",
          "type": "Uint8Array"
        },
        {
          "internalType": "uint256",
          "name": "_block",
          "type": "uint256"
        }
      ],
      "name": "balanceOfAt",
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
      "name": "checkpoint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_unlockTime",
          "type": "uint256"
        }
      ],
      "name": "createLock",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "_addr",
          "type": "Uint8Array"
        },
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "depositFor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "earlyWithdrawPenaltyRate",
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
      "name": "emergencyWithdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "epoch",
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
      "name": "futureSmartWalletChecker",
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
          "name": "_addr",
          "type": "Uint8Array"
        }
      ],
      "name": "getLastUserSlope",
      "outputs": [
        {
          "internalType": "int128",
          "name": "",
          "type": "int128"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "increaseAmount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_unlockTime",
          "type": "uint256"
        }
      ],
      "name": "increaseUnlockTime",
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
        }
      ],
      "name": "locked",
      "outputs": [
        {
          "internalType": "int128",
          "name": "amount",
          "type": "int128"
        },
        {
          "internalType": "uint256",
          "name": "end",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "_addr",
          "type": "Uint8Array"
        }
      ],
      "name": "locked__end",
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
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
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
      "name": "penaltyCollector",
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
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "pointHistory",
      "outputs": [
        {
          "internalType": "int128",
          "name": "bias",
          "type": "int128"
        },
        {
          "internalType": "int128",
          "name": "slope",
          "type": "int128"
        },
        {
          "internalType": "uint256",
          "name": "ts",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "blk",
          "type": "uint256"
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
          "internalType": "uint256",
          "name": "_rate",
          "type": "uint256"
        }
      ],
      "name": "setEarlyWithdrawPenaltyRate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "_addr",
          "type": "Uint8Array"
        }
      ],
      "name": "setPenaltyCollector",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "slopeChanges",
      "outputs": [
        {
          "internalType": "int128",
          "name": "",
          "type": "int128"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "smartWalletChecker",
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
      "name": "supply",
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
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
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
      "inputs": [],
      "name": "totalSupply",
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
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_t",
          "type": "uint256"
        }
      ],
      "name": "totalSupply",
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
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_block",
          "type": "uint256"
        }
      ],
      "name": "totalSupplyAt",
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
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "",
          "type": "Uint8Array"
        }
      ],
      "name": "userPointEpoch",
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
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "",
          "type": "Uint8Array"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "userPointHistory",
      "outputs": [
        {
          "internalType": "int128",
          "name": "bias",
          "type": "int128"
        },
        {
          "internalType": "int128",
          "name": "slope",
          "type": "int128"
        },
        {
          "internalType": "uint256",
          "name": "ts",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "blk",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "_addr",
          "type": "Uint8Array"
        },
        {
          "internalType": "uint256",
          "name": "_idx",
          "type": "uint256"
        }
      ],
      "name": "userPointHistory__ts",
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
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
}
