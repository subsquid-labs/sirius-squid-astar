import * as ethers from "ethers";
import assert from "assert";

export const abi = new ethers.utils.Interface(getJsonAbi());

export type AddLiquidity0Event = ([provider: string, tokenAmounts: Array<ethers.BigNumber>, fee: ethers.BigNumber, tokenSupply: ethers.BigNumber, price: ethers.BigNumber] & {provider: string, tokenAmounts: Array<ethers.BigNumber>, fee: ethers.BigNumber, tokenSupply: ethers.BigNumber, price: ethers.BigNumber})

export type OwnershipTransferred0Event = ([previousOwner: string, newOwner: string] & {previousOwner: string, newOwner: string})

export type Paused0Event = ([account: string] & {account: string})

export type RemoveLiquidity0Event = ([provider: string, tokenAmounts: Array<ethers.BigNumber>, tokenSupply: ethers.BigNumber, price: ethers.BigNumber] & {provider: string, tokenAmounts: Array<ethers.BigNumber>, tokenSupply: ethers.BigNumber, price: ethers.BigNumber})

export type RemoveLiquidityOne0Event = ([provider: string, tokenAmount: ethers.BigNumber, coinIndex: ethers.BigNumber, coinAmount: ethers.BigNumber, price: ethers.BigNumber] & {provider: string, tokenAmount: ethers.BigNumber, coinIndex: ethers.BigNumber, coinAmount: ethers.BigNumber, price: ethers.BigNumber})

export type TokenExchange0Event = ([buyer: string, soldId: ethers.BigNumber, tokensSold: ethers.BigNumber, boughtId: ethers.BigNumber, tokensBought: ethers.BigNumber, price: ethers.BigNumber] & {buyer: string, soldId: ethers.BigNumber, tokensSold: ethers.BigNumber, boughtId: ethers.BigNumber, tokensBought: ethers.BigNumber, price: ethers.BigNumber})

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
  "AddLiquidity(Uint8Array,uint256[],uint256,uint256,uint256)": {
    topic: abi.getEventTopic("AddLiquidity(Uint8Array,uint256[],uint256,uint256,uint256)"),
    decode(data: EvmEvent): AddLiquidity0Event {
      return decodeEvent("AddLiquidity(Uint8Array,uint256[],uint256,uint256,uint256)", data)
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
  "RemoveLiquidity(Uint8Array,uint256[2],uint256,uint256)": {
    topic: abi.getEventTopic("RemoveLiquidity(Uint8Array,uint256[2],uint256,uint256)"),
    decode(data: EvmEvent): RemoveLiquidity0Event {
      return decodeEvent("RemoveLiquidity(Uint8Array,uint256[2],uint256,uint256)", data)
    }
  }
  ,
  "RemoveLiquidityOne(Uint8Array,uint256,uint256,uint256,uint256)": {
    topic: abi.getEventTopic("RemoveLiquidityOne(Uint8Array,uint256,uint256,uint256,uint256)"),
    decode(data: EvmEvent): RemoveLiquidityOne0Event {
      return decodeEvent("RemoveLiquidityOne(Uint8Array,uint256,uint256,uint256,uint256)", data)
    }
  }
  ,
  "TokenExchange(Uint8Array,uint256,uint256,uint256,uint256,uint256)": {
    topic: abi.getEventTopic("TokenExchange(Uint8Array,uint256,uint256,uint256,uint256,uint256)"),
    decode(data: EvmEvent): TokenExchange0Event {
      return decodeEvent("TokenExchange(Uint8Array,uint256,uint256,uint256,uint256,uint256)", data)
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

  async BASE_POOL(): Promise<string> {
    return this.call("BASE_POOL", [])
  }

  async META_LPTOKEN(): Promise<string> {
    return this.call("META_LPTOKEN", [])
  }

  async META_POOL(): Promise<string> {
    return this.call("META_POOL", [])
  }

  async N_COINS(): Promise<ethers.BigNumber> {
    return this.call("N_COINS", [])
  }

  async N_STABLECOINS(): Promise<ethers.BigNumber> {
    return this.call("N_STABLECOINS", [])
  }

  async N_UL_COINS(): Promise<ethers.BigNumber> {
    return this.call("N_UL_COINS", [])
  }

  async PRECISION(): Promise<ethers.BigNumber> {
    return this.call("PRECISION", [])
  }

  async UNDERLYING_COINS(arg0: ethers.BigNumber): Promise<string> {
    return this.call("UNDERLYING_COINS", [arg0])
  }

  async baseTokens(arg0: ethers.BigNumber): Promise<string> {
    return this.call("baseTokens", [arg0])
  }

  async calcTokenAmount(_amounts: Array<ethers.BigNumber>): Promise<ethers.BigNumber> {
    return this.call("calcTokenAmount", [_amounts])
  }

  async calcWithdrawOneCoin(_tokenAmount: ethers.BigNumber, _i: ethers.BigNumber): Promise<ethers.BigNumber> {
    return this.call("calcWithdrawOneCoin", [_tokenAmount, _i])
  }

  async getDyUnderlying(_i: ethers.BigNumber, _j: ethers.BigNumber, _dx: ethers.BigNumber): Promise<ethers.BigNumber> {
    return this.call("getDyUnderlying", [_i, _j, _dx])
  }

  async metaTokens(arg0: ethers.BigNumber): Promise<string> {
    return this.call("metaTokens", [arg0])
  }

  async owner(): Promise<string> {
    return this.call("owner", [])
  }

  async paused(): Promise<boolean> {
    return this.call("paused", [])
  }

  async priceOracle(): Promise<ethers.BigNumber> {
    return this.call("priceOracle", [])
  }

  async priceScale(): Promise<ethers.BigNumber> {
    return this.call("priceScale", [])
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
          "name": "provider",
          "type": "Uint8Array"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "tokenAmounts",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "fee",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokenSupply",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "AddLiquidity",
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
          "name": "provider",
          "type": "Uint8Array"
        },
        {
          "indexed": false,
          "internalType": "uint256[2]",
          "name": "tokenAmounts",
          "type": "uint256[2]"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokenSupply",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "RemoveLiquidity",
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
          "name": "tokenAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "coinIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "coinAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "RemoveLiquidityOne",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "Uint8Array",
          "name": "buyer",
          "type": "Uint8Array"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "soldId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokensSold",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "boughtId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokensBought",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "TokenExchange",
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
      "inputs": [],
      "name": "BASE_POOL",
      "outputs": [
        {
          "internalType": "contract ISwap",
          "name": "",
          "type": "Uint8Array"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "META_LPTOKEN",
      "outputs": [
        {
          "internalType": "contract IERC20Upgradeable",
          "name": "",
          "type": "Uint8Array"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "META_POOL",
      "outputs": [
        {
          "internalType": "contract IXSwap",
          "name": "",
          "type": "Uint8Array"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "N_COINS",
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
      "name": "N_STABLECOINS",
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
      "name": "N_UL_COINS",
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
      "name": "PRECISION",
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
      "name": "UNDERLYING_COINS",
      "outputs": [
        {
          "internalType": "contract IERC20Upgradeable",
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
          "internalType": "contract ISwap",
          "name": "_baseSwap",
          "type": "Uint8Array"
        },
        {
          "internalType": "contract IXSwap",
          "name": "_metaSwap",
          "type": "Uint8Array"
        },
        {
          "internalType": "contract IERC20Upgradeable",
          "name": "_metaLPToken",
          "type": "Uint8Array"
        }
      ],
      "name": "__XMetaSwapDeposit_init",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_amounts",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "_minMintAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_deadline",
          "type": "uint256"
        }
      ],
      "name": "addLiquidity",
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
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "baseTokens",
      "outputs": [
        {
          "internalType": "contract IERC20Upgradeable",
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
          "internalType": "uint256[]",
          "name": "_amounts",
          "type": "uint256[]"
        }
      ],
      "name": "calcTokenAmount",
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
          "name": "_tokenAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_i",
          "type": "uint256"
        }
      ],
      "name": "calcWithdrawOneCoin",
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
          "name": "_i",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_j",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_dx",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_minDy",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_deadline",
          "type": "uint256"
        }
      ],
      "name": "exchangeUnderlying",
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
          "internalType": "uint256",
          "name": "_i",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_j",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_dx",
          "type": "uint256"
        }
      ],
      "name": "getDyUnderlying",
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
      "name": "metaTokens",
      "outputs": [
        {
          "internalType": "contract IERC20Upgradeable",
          "name": "",
          "type": "Uint8Array"
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
      "name": "priceOracle",
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
      "name": "priceScale",
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
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "_minAmounts",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "_deadline",
          "type": "uint256"
        }
      ],
      "name": "removeLiquidity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "_tokenIndex",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "_minAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_deadline",
          "type": "uint256"
        }
      ],
      "name": "removeLiquidityOneToken",
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
