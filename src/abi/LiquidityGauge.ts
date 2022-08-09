import * as ethers from "ethers";
import assert from "assert";

export const abi = new ethers.utils.Interface(getJsonAbi());

export type Approval0Event = ([owner: string, spender: string, value: ethers.BigNumber] & {owner: string, spender: string, value: ethers.BigNumber})

export type Deposit0Event = ([provider: string, value: ethers.BigNumber] & {provider: string, value: ethers.BigNumber})

export type OwnershipTransferred0Event = ([previousOwner: string, newOwner: string] & {previousOwner: string, newOwner: string})

export type Paused0Event = ([account: string] & {account: string})

export type Transfer0Event = ([from: string, to: string, value: ethers.BigNumber] & {from: string, to: string, value: ethers.BigNumber})

export type Unpaused0Event = ([account: string] & {account: string})

export type UpdateLiquidityLimit0Event = ([user: string, originalBalance: ethers.BigNumber, originalSupply: ethers.BigNumber, workingBalance: ethers.BigNumber, workingSupply: ethers.BigNumber] & {user: string, originalBalance: ethers.BigNumber, originalSupply: ethers.BigNumber, workingBalance: ethers.BigNumber, workingSupply: ethers.BigNumber})

export type Withdraw0Event = ([provider: string, value: ethers.BigNumber] & {provider: string, value: ethers.BigNumber})

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
  "Approval(Uint8Array,Uint8Array,uint256)": {
    topic: abi.getEventTopic("Approval(Uint8Array,Uint8Array,uint256)"),
    decode(data: EvmEvent): Approval0Event {
      return decodeEvent("Approval(Uint8Array,Uint8Array,uint256)", data)
    }
  }
  ,
  "Deposit(Uint8Array,uint256)": {
    topic: abi.getEventTopic("Deposit(Uint8Array,uint256)"),
    decode(data: EvmEvent): Deposit0Event {
      return decodeEvent("Deposit(Uint8Array,uint256)", data)
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
  "Transfer(Uint8Array,Uint8Array,uint256)": {
    topic: abi.getEventTopic("Transfer(Uint8Array,Uint8Array,uint256)"),
    decode(data: EvmEvent): Transfer0Event {
      return decodeEvent("Transfer(Uint8Array,Uint8Array,uint256)", data)
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
  "UpdateLiquidityLimit(Uint8Array,uint256,uint256,uint256,uint256)": {
    topic: abi.getEventTopic("UpdateLiquidityLimit(Uint8Array,uint256,uint256,uint256,uint256)"),
    decode(data: EvmEvent): UpdateLiquidityLimit0Event {
      return decodeEvent("UpdateLiquidityLimit(Uint8Array,uint256,uint256,uint256,uint256)", data)
    }
  }
  ,
  "Withdraw(Uint8Array,uint256)": {
    topic: abi.getEventTopic("Withdraw(Uint8Array,uint256)"),
    decode(data: EvmEvent): Withdraw0Event {
      return decodeEvent("Withdraw(Uint8Array,uint256)", data)
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

  async GAUGE_CONTROLLER(): Promise<string> {
    return this.call("GAUGE_CONTROLLER", [])
  }

  async MAX_REWARDS(): Promise<ethers.BigNumber> {
    return this.call("MAX_REWARDS", [])
  }

  async MINTER(): Promise<string> {
    return this.call("MINTER", [])
  }

  async MULTIPLIER(): Promise<ethers.BigNumber> {
    return this.call("MULTIPLIER", [])
  }

  async SRS(): Promise<string> {
    return this.call("SRS", [])
  }

  async TOKENLESS_PRODUCTION(): Promise<ethers.BigNumber> {
    return this.call("TOKENLESS_PRODUCTION", [])
  }

  async VOTING_ESCROW(): Promise<string> {
    return this.call("VOTING_ESCROW", [])
  }

  async WEEK(): Promise<ethers.BigNumber> {
    return this.call("WEEK", [])
  }

  async allowance(owner: string, spender: string): Promise<ethers.BigNumber> {
    return this.call("allowance", [owner, spender])
  }

  async balanceOf(account: string): Promise<ethers.BigNumber> {
    return this.call("balanceOf", [account])
  }

  async claimData(arg0: string, arg1: string): Promise<ethers.BigNumber> {
    return this.call("claimData", [arg0, arg1])
  }

  async claimableReward(_user: string, _rewardToken: string): Promise<ethers.BigNumber> {
    return this.call("claimableReward", [_user, _rewardToken])
  }

  async claimedReward(_addr: string, _token: string): Promise<ethers.BigNumber> {
    return this.call("claimedReward", [_addr, _token])
  }

  async decimals(): Promise<number> {
    return this.call("decimals", [])
  }

  async futureEpochTime(): Promise<ethers.BigNumber> {
    return this.call("futureEpochTime", [])
  }

  async inflationRate(): Promise<ethers.BigNumber> {
    return this.call("inflationRate", [])
  }

  async integrateCheckpoint(): Promise<ethers.BigNumber> {
    return this.call("integrateCheckpoint", [])
  }

  async integrateCheckpointOf(arg0: string): Promise<ethers.BigNumber> {
    return this.call("integrateCheckpointOf", [arg0])
  }

  async integrateFraction(arg0: string): Promise<ethers.BigNumber> {
    return this.call("integrateFraction", [arg0])
  }

  async integrateInvSupply(arg0: ethers.BigNumber): Promise<ethers.BigNumber> {
    return this.call("integrateInvSupply", [arg0])
  }

  async integrateInvSupplyOf(arg0: string): Promise<ethers.BigNumber> {
    return this.call("integrateInvSupplyOf", [arg0])
  }

  async isKilled(): Promise<boolean> {
    return this.call("isKilled", [])
  }

  async lpToken(): Promise<string> {
    return this.call("lpToken", [])
  }

  async name(): Promise<string> {
    return this.call("name", [])
  }

  async owner(): Promise<string> {
    return this.call("owner", [])
  }

  async paused(): Promise<boolean> {
    return this.call("paused", [])
  }

  async period(): Promise<ethers.BigNumber> {
    return this.call("period", [])
  }

  async periodTimestamp(arg0: ethers.BigNumber): Promise<ethers.BigNumber> {
    return this.call("periodTimestamp", [arg0])
  }

  async rewardCount(): Promise<ethers.BigNumber> {
    return this.call("rewardCount", [])
  }

  async rewardData(arg0: string): Promise<([token: string, distributor: string, periodFinish: ethers.BigNumber, rate: ethers.BigNumber, lastUpdate: ethers.BigNumber, integral: ethers.BigNumber] & {token: string, distributor: string, periodFinish: ethers.BigNumber, rate: ethers.BigNumber, lastUpdate: ethers.BigNumber, integral: ethers.BigNumber})> {
    return this.call("rewardData", [arg0])
  }

  async rewardIntegralFor(arg0: string, arg1: string): Promise<ethers.BigNumber> {
    return this.call("rewardIntegralFor", [arg0, arg1])
  }

  async rewardTokens(arg0: ethers.BigNumber): Promise<string> {
    return this.call("rewardTokens", [arg0])
  }

  async rewardsReceiver(arg0: string): Promise<string> {
    return this.call("rewardsReceiver", [arg0])
  }

  async symbol(): Promise<string> {
    return this.call("symbol", [])
  }

  async totalSupply(): Promise<ethers.BigNumber> {
    return this.call("totalSupply", [])
  }

  async workingBalances(arg0: string): Promise<ethers.BigNumber> {
    return this.call("workingBalances", [arg0])
  }

  async workingSupply(): Promise<ethers.BigNumber> {
    return this.call("workingSupply", [])
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
          "name": "owner",
          "type": "Uint8Array"
        },
        {
          "indexed": true,
          "internalType": "Uint8Array",
          "name": "spender",
          "type": "Uint8Array"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
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
          "indexed": true,
          "internalType": "Uint8Array",
          "name": "from",
          "type": "Uint8Array"
        },
        {
          "indexed": true,
          "internalType": "Uint8Array",
          "name": "to",
          "type": "Uint8Array"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
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
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "Uint8Array",
          "name": "user",
          "type": "Uint8Array"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "originalBalance",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "originalSupply",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "workingBalance",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "workingSupply",
          "type": "uint256"
        }
      ],
      "name": "UpdateLiquidityLimit",
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
        }
      ],
      "name": "Withdraw",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "GAUGE_CONTROLLER",
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
      "name": "MAX_REWARDS",
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
      "name": "MINTER",
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
      "name": "SRS",
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
      "name": "TOKENLESS_PRODUCTION",
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
      "name": "VOTING_ESCROW",
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
          "name": "_lpToken",
          "type": "Uint8Array"
        },
        {
          "internalType": "Uint8Array",
          "name": "_minter",
          "type": "Uint8Array"
        },
        {
          "internalType": "Uint8Array",
          "name": "_srs",
          "type": "Uint8Array"
        },
        {
          "internalType": "Uint8Array",
          "name": "_veToken",
          "type": "Uint8Array"
        },
        {
          "internalType": "Uint8Array",
          "name": "_gaugeCtrl",
          "type": "Uint8Array"
        }
      ],
      "name": "__LiquidityGauge_init",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "_rewardToken",
          "type": "Uint8Array"
        },
        {
          "internalType": "Uint8Array",
          "name": "_distributor",
          "type": "Uint8Array"
        }
      ],
      "name": "addReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "owner",
          "type": "Uint8Array"
        },
        {
          "internalType": "Uint8Array",
          "name": "spender",
          "type": "Uint8Array"
        }
      ],
      "name": "allowance",
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
          "name": "spender",
          "type": "Uint8Array"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
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
          "name": "account",
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
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "account",
          "type": "Uint8Array"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "burnFrom",
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
      "name": "claimData",
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
          "internalType": "Uint8Array",
          "name": "_receiver",
          "type": "Uint8Array"
        }
      ],
      "name": "claimRewards",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "_user",
          "type": "Uint8Array"
        },
        {
          "internalType": "Uint8Array",
          "name": "_rewardToken",
          "type": "Uint8Array"
        }
      ],
      "name": "claimableReward",
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
      "name": "claimableTokens",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
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
          "internalType": "Uint8Array",
          "name": "_token",
          "type": "Uint8Array"
        }
      ],
      "name": "claimedReward",
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
          "name": "spender",
          "type": "Uint8Array"
        },
        {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
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
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        },
        {
          "internalType": "Uint8Array",
          "name": "_addr",
          "type": "Uint8Array"
        },
        {
          "internalType": "bool",
          "name": "_claimRewards",
          "type": "bool"
        }
      ],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "_rewardToken",
          "type": "Uint8Array"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "depositRewardToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "futureEpochTime",
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
          "name": "spender",
          "type": "Uint8Array"
        },
        {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
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
      "inputs": [],
      "name": "inflationRate",
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
      "name": "integrateCheckpoint",
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
        }
      ],
      "name": "integrateCheckpointOf",
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
        }
      ],
      "name": "integrateFraction",
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
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "integrateInvSupply",
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
        }
      ],
      "name": "integrateInvSupplyOf",
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
      "name": "isKilled",
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
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "_addr",
          "type": "Uint8Array"
        }
      ],
      "name": "kick",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "lpToken",
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
      "name": "period",
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
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "periodTimestamp",
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
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "rewardCount",
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
        }
      ],
      "name": "rewardData",
      "outputs": [
        {
          "internalType": "Uint8Array",
          "name": "token",
          "type": "Uint8Array"
        },
        {
          "internalType": "Uint8Array",
          "name": "distributor",
          "type": "Uint8Array"
        },
        {
          "internalType": "uint256",
          "name": "periodFinish",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "rate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "lastUpdate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "integral",
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
          "internalType": "Uint8Array",
          "name": "",
          "type": "Uint8Array"
        }
      ],
      "name": "rewardIntegralFor",
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
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "rewardTokens",
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
          "name": "",
          "type": "Uint8Array"
        }
      ],
      "name": "rewardsReceiver",
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
          "internalType": "bool",
          "name": "_isKilled",
          "type": "bool"
        }
      ],
      "name": "setKilled",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "_rewardToken",
          "type": "Uint8Array"
        },
        {
          "internalType": "Uint8Array",
          "name": "_distributor",
          "type": "Uint8Array"
        }
      ],
      "name": "setRewardDistributor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "_receiver",
          "type": "Uint8Array"
        }
      ],
      "name": "setRewardsReceiver",
      "outputs": [],
      "stateMutability": "nonpayable",
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
          "internalType": "Uint8Array",
          "name": "_to",
          "type": "Uint8Array"
        },
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
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
          "name": "sender",
          "type": "Uint8Array"
        },
        {
          "internalType": "Uint8Array",
          "name": "recipient",
          "type": "Uint8Array"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
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
    },
    {
      "inputs": [
        {
          "internalType": "Uint8Array",
          "name": "_addr",
          "type": "Uint8Array"
        }
      ],
      "name": "userCheckpoint",
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
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_claimRewards",
          "type": "bool"
        }
      ],
      "name": "withdraw",
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
      "name": "workingBalances",
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
      "name": "workingSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
}
