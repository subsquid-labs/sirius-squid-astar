// import { Uint8Array, BigDecimal, bigint, ethereum } from "@graphprotocol/graph-ts"

import { Store } from '@subsquid/typeorm-store'

import { Airdropee, Swap, Token, TokenObject } from '../model'
// import { SwapNormal } from "../../generated/Sirius4Pool/SwapNormal"
import { getOrCreateToken } from './token'
import { getSystemInfo } from './system'
import { decodeHex, EvmLogHandlerContext, toHex } from '@subsquid/substrate-processor'

import * as SwapNormal from '../abi/SwapNormal'
import * as MetaSwap from '../abi/MetaSwap'
import * as XSwapDeposit from '../abi/XSwapDeposit'
import * as ERC20 from '../abi/ERC20'

import { Big as BigDecimal } from 'big.js'
import { BigNumber } from 'ethers'
// import { MetaSwap } from "../../generated/BAImetapool/MetaSwap"
// import { XSwapDeposit } from "../../generated/JPYCmetapoolDeposit/XSwapDeposit"
// import { ERC20 } from "../../generated/JPYCmetapoolDeposit/ERC20"

// import { log } from '@graphprotocol/graph-ts'

const ZERO_Uint8Array = '0x0000000000000000000000000000000000000000'

interface SwapInfo {
    baseSwapAddress: string
    tokens: string[]
    baseTokens: string[]
    allTokens: string[] // tokens + basePool Tokens (metaSwap)
    balances: bigint[]
    a: bigint
    swapFee: bigint
    adminFee: bigint
    virtualPrice: bigint
    owner: string
    lpToken: string
}

export async function getOrCreateSwap(ctx: EvmLogHandlerContext<Store>, address: string): Promise<Swap> {
    let swap = await ctx.store.get(Swap, address)

    if (swap == null) {
        let info = await getSwapInfo(ctx, address)

        swap = new Swap({ id: address })
        swap.address = decodeHex(address)
        swap.baseSwapAddress = decodeHex(info.baseSwapAddress)
        swap.numTokens = info.tokens.length
        swap.tokens = (await registerTokens(ctx, info.tokens)).map((t) => new TokenObject(t))
        swap.baseTokens = (await registerTokens(ctx, info.baseTokens)).map((t) => new TokenObject(t))
        swap.allTokens = (await registerTokens(ctx, info.allTokens)).map((t) => new TokenObject(t))
        swap.balances = info.balances
        swap.lpToken = decodeHex(info.lpToken)

        swap.a = info.a

        swap.swapFee = info.swapFee
        swap.adminFee = info.adminFee

        swap.virtualPrice = info.virtualPrice

        swap.owner = decodeHex(info.owner)

        swap.tvl = BigDecimal(0).toString()
        swap.apy = BigDecimal(0).toString()

        await ctx.store.save(swap)

        let system = await getSystemInfo(ctx)
        system.swapCount += 1n
        await ctx.store.save(system)
    }

    return swap as Swap
}

// TODO refactor
// Gets poll info from swap contract
export async function getSwapInfo(ctx: EvmLogHandlerContext<Store>, address: string): Promise<SwapInfo> {
    let swapContract = new SwapNormal.Contract(ctx, address)

    let tokens: string[] = []
    let balances: bigint[] = []

    let i = 0

    while (true) {
        try {
            const t = await swapContract.getToken(i)
            const b = (await swapContract.getTokenBalance(i)).toBigInt()

            if (t != ZERO_Uint8Array) {
                tokens.push(t)
            }

            balances.push(b)

            i++
        } catch (e) {
            break
        }
    }

    let swapStorage = await swapContract.swapStorage()

    return {
        baseSwapAddress: address,
        tokens,
        baseTokens: tokens,
        allTokens: tokens,
        balances,
        a: (await swapContract.getA()).toBigInt(),
        swapFee: swapStorage[4].toBigInt(),
        adminFee: swapStorage[5].toBigInt(),
        virtualPrice: (await swapContract.getVirtualPrice()).toBigInt(),
        owner: await swapContract.owner(),
        lpToken: swapStorage[6],
    }
}

export async function getBalancesSwap(
    ctx: EvmLogHandlerContext<Store>,
    swap: string,
    N_COINS: number
): Promise<bigint[]> {
    let swapContract = new SwapNormal.Contract(ctx, swap)
    let balances: bigint[] = new Array(N_COINS)

    for (let i = 0; i < N_COINS; ++i) {
        balances[i] = (await swapContract.getTokenBalance(i)).toBigInt()
    }

    return balances
}

export async function getOrCreateMetaSwap(ctx: EvmLogHandlerContext<Store>): Promise<Swap> {
    const address = ctx.event.args.address

    let swap = await ctx.store.get(Swap, address)

    if (swap == null) {
        let info = await getMetaSwapInfo(ctx, address)

        swap = new Swap({ id: address })
        swap.address = decodeHex(address)
        swap.baseSwapAddress = decodeHex(info.baseSwapAddress)
        swap.numTokens = info.tokens.length
        swap.tokens = (await registerTokens(ctx, info.tokens)).map((t) => new TokenObject(t))
        swap.baseTokens = (await registerTokens(ctx, info.baseTokens)).map((t) => new TokenObject(t))
        swap.allTokens = (await registerTokens(ctx, info.allTokens)).map((t) => new TokenObject(t))
        swap.balances = info.balances
        swap.lpToken = decodeHex(info.lpToken)

        swap.a = info.a

        swap.swapFee = info.swapFee
        swap.adminFee = info.adminFee

        swap.virtualPrice = info.virtualPrice

        swap.owner = decodeHex(info.owner)

        swap.tvl = BigDecimal(0).toString()
        swap.apy = BigDecimal(0).toString()

        await ctx.store.save(swap)

        let system = await getSystemInfo(ctx)
        system.swapCount += 1n
        await ctx.store.save(system)
    }

    return swap
}

// Gets poll info from swap contract
export async function getMetaSwapInfo(ctx: EvmLogHandlerContext<Store>, address: string): Promise<SwapInfo> {
    let swapContract = new MetaSwap.Contract(ctx, address)

    let tokens: string[] = []
    let baseTokens: string[] = []
    let balances: bigint[] = []
    let allTokens: string[] = []

    // get metapool tokens
    let i = 0

    while (true) {
        try {
            const t = await swapContract.getToken(i)
            const b = (await swapContract.getTokenBalance(i)).toBigInt()

            if (t != ZERO_Uint8Array) {
                tokens.push(t)
            }

            balances.push(b)

            i++
        } catch (e) {
            break
        }
    }

    // get the lp token bounded basepool tokens
    let baseSwapAddress = (await swapContract.metaSwapStorage())[0]
    let baseSwapContract = new SwapNormal.Contract(ctx, baseSwapAddress)

    let j = 0

    while (true) {
        try {
            const t = await baseSwapContract.getToken(j)

            if (t != ZERO_Uint8Array) {
                ctx.log.info(`${j}: ${t}`)
                baseTokens.push(t)
            }

            j++
        } catch (e) {
            break
        }
    }

    // combine metapool tokens and basepool tokens to get all tokens
    allTokens = tokens.slice()
    allTokens.pop()

    for (let i = 0; i < baseTokens.length; i++) {
        allTokens.push(baseTokens[i])
    }

    let swapStorage = await swapContract.swapStorage()

    return {
        baseSwapAddress,
        tokens,
        baseTokens,
        allTokens,
        balances,
        a: (await swapContract.getA()).toBigInt(),
        swapFee: swapStorage[4].toBigInt(),
        adminFee: swapStorage[5].toBigInt(),
        virtualPrice: (await swapContract.getVirtualPrice()).toBigInt(),
        owner: await swapContract.owner(),
        lpToken: swapStorage[6],
    }
}

export async function getBalancesMetaSwap(
    ctx: EvmLogHandlerContext<Store>,
    swap: string,
    N_COINS: number
): Promise<bigint[]> {
    let swapContract = new MetaSwap.Contract(ctx, swap)
    let balances: bigint[] = new Array(N_COINS)

    for (let i = 0; i < N_COINS; ++i) {
        balances[i] = (await swapContract.getTokenBalance(i)).toBigInt()
    }

    return balances
}

export async function getOrCreateXSwap(ctx: EvmLogHandlerContext<Store>, address: string): Promise<Swap> {
    let swap = await ctx.store.get(Swap, address)

    if (swap == null) {
        let info = await getXSwapInfo(ctx, address)

        swap = new Swap({ id: address })
        swap.address = decodeHex(address)
        swap.baseSwapAddress = decodeHex(info.baseSwapAddress)
        swap.numTokens = info.tokens.length
        swap.tokens = (await registerTokens(ctx, info.tokens)).map((t) => new TokenObject(t))
        swap.baseTokens = (await registerTokens(ctx, info.baseTokens)).map((t) => new TokenObject(t))
        swap.allTokens = (await registerTokens(ctx, info.allTokens)).map((t) => new TokenObject(t))
        swap.balances = info.balances
        swap.lpToken = decodeHex(info.lpToken)

        swap.a = info.a

        swap.swapFee = info.swapFee
        swap.adminFee = info.adminFee

        swap.virtualPrice = info.virtualPrice

        swap.owner = decodeHex(info.owner)

        swap.tvl = '0'
        swap.apy = '0'

        await ctx.store.save(swap)

        let system = await getSystemInfo(ctx)
        system.swapCount += 1n
        await ctx.store.save(system)
    }

    return swap
}

// Gets poll info from swap contract
export async function getXSwapInfo(ctx: EvmLogHandlerContext<Store>, swap: string): Promise<SwapInfo> {
    let swapContract = new XSwapDeposit.Contract(ctx, swap)

    let tokens: string[] = []
    let baseTokens: string[] = []
    let balances: bigint[] = []
    let allTokens: string[] = []

    // get metapool tokens
    let i = 0

    while (true) {
        try {
            let t = await swapContract.UNDERLYING_COINS(BigNumber.from(i))
            let tokenContract = new ERC20.Contract(ctx, t)
            let b = (await tokenContract.balanceOf(swap)).toBigInt()

            if (t != ZERO_Uint8Array) {
                tokens.push(t)
            }

            balances.push(b)

            i++
        } catch (e) {
            break
        }
    }

    // get the lp token bounded basepool tokens
    let baseSwapAddress = await swapContract.BASE_POOL()
    let baseSwapContract = new SwapNormal.Contract(ctx, baseSwapAddress)

    let j = 0

    while (true) {
        try {
            const t = await baseSwapContract.getToken(j)

            if (t != ZERO_Uint8Array) {
                ctx.log.info(`${j}: ${t}`)
                baseTokens.push(t)
            }

            j++
        } catch (e) {
            break
        }
    }

    // for xSwapDeposit, tokens equal allTokens
    allTokens = tokens

    return {
        baseSwapAddress,
        tokens,
        baseTokens,
        allTokens,
        balances,
        a: 0n,
        swapFee: 0n,
        adminFee: 0n,
        virtualPrice: (await swapContract.priceOracle()).toBigInt(),
        owner: await swapContract.owner(),
        lpToken: await swapContract.META_LPTOKEN(),
    }
}

export async function getBalancesXSwap(
    ctx: EvmLogHandlerContext<Store>,
    swap: string,
    N_COINS: number
): Promise<bigint[]> {
    let swapContract = new XSwapDeposit.Contract(ctx, swap)
    let balances: bigint[] = new Array(N_COINS)

    for (let i = 0; i < N_COINS; ++i) {
        let t = await swapContract.UNDERLYING_COINS(BigNumber.from(i))
        let tokenContract = new ERC20.Contract(ctx, t)
        balances[i] = (await tokenContract.balanceOf(swap)).toBigInt()
    }

    return balances
}

async function registerTokens(ctx: EvmLogHandlerContext<Store>, list: string[]): Promise<Token[]> {
    let result: Token[] = []

    for (let i = 0; i < list.length; ++i) {
        let current = list[i]

        if (current != ZERO_Uint8Array) {
            let token = await getOrCreateToken(ctx, current)

            result.push(token)
        }
    }

    return result
}

export async function getOrCreateAirdropee(ctx: EvmLogHandlerContext<Store>, address: string): Promise<Airdropee> {
    let airdropee = await ctx.store.get(Airdropee, address)

    if (airdropee == null) {
        airdropee = new Airdropee({ id: address })
        airdropee.address = decodeHex(address)
        airdropee.count = 0n
        airdropee.swapCount = 0n
        airdropee.addLiquidityCount = 0n
        airdropee.removeLiquidityCount = 0n
        airdropee.removeLiquidityImbalanceCount = 0n
        airdropee.removeLiquidityOneCount = 0n
        airdropee.farmDepositCount = 0n
        airdropee.farmWithdrawCount = 0n
        airdropee.farmClaimCount = 0n
        airdropee.updated = BigInt(ctx.block.timestamp)
        airdropee.updatedAtBlock = BigInt(ctx.block.height)
        airdropee.updatedAtTransaction = decodeHex(ctx.event.evmTxHash)

        await ctx.store.save(airdropee)
    }

    return airdropee
}
