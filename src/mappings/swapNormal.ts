import {
    AddLiquidityEventData, Exchange,
    NewAdminFeeEventData,
    NewSwapFeeEventData,
    RampAEventData,
    RemoveLiquidityEventData,
    StopRampAEventData,
    SwapEvent,
    TokenExchangeData,
} from '../model'
import { Big as BigDecimal } from 'big.js'
import {
    getBalancesSwap,
    getBalancesMetaSwap,
    getOrCreateAirdropee,
    getOrCreateMetaSwap,
    getOrCreateSwap,
} from '../entities/swap'
import { getDailyTradeVolume, getHourlyTradeVolume, getWeeklyTradeVolume } from '../entities/volume'
import { getDailyPoolTvl } from '../entities/tvl'

import { getOrCreateToken } from '../entities/token'
import { getSystemInfo } from '../entities/system'
import { decodeHex, EvmLogHandlerContext, toHex } from '@subsquid/substrate-processor'
import { Store } from '@subsquid/typeorm-store'
import * as SwapNormal from '../abi/SwapNormal'

export async function handleNewAdminFee(ctx: EvmLogHandlerContext<Store>): Promise<void> {
    let swap = await getOrCreateSwap(ctx)

    const event = SwapNormal.events['NewAdminFee(uint256)'].decode(ctx.event.args)
    swap.adminFee = event.newAdminFee.toBigInt()
    await ctx.store.save(swap)

    let log = new SwapEvent({ id: 'new_admin_fee-' + ctx.event.evmTxHash })

    log.swap = swap

    log.data = new NewAdminFeeEventData()
    log.data.newFee = event.newAdminFee.toBigInt()

    log.block = BigInt(ctx.block.height)
    log.timestamp = BigInt(ctx.block.timestamp)
    log.transaction = decodeHex(ctx.event.evmTxHash)

    await ctx.store.save(log)
}

export async function handleNewSwapFee(ctx: EvmLogHandlerContext<Store>): Promise<void> {
    let swap = await getOrCreateSwap(ctx)

    const event = SwapNormal.events['NewSwapFee(uint256)'].decode(ctx.event.args)
    swap.swapFee = event.newSwapFee.toBigInt()
    await ctx.store.save(swap)

    let log = new SwapEvent({ id: 'new_swap_fee-' + ctx.event.evmTxHash })

    log.swap = swap

    log.data = new NewSwapFeeEventData()
    log.data.newFee = event.newSwapFee.toBigInt()

    log.block = BigInt(ctx.block.height)
    log.timestamp = BigInt(ctx.block.timestamp)
    log.transaction = decodeHex(ctx.event.evmTxHash)

    await ctx.store.save(log)
}

export async function handleNewWithdrawFee(ctx: EvmLogHandlerContext<Store>): Promise<void> {
    let swap = await getOrCreateSwap(ctx)

    const event = SwapNormal.events['NewWithdrawFee(uint256)'].decode(ctx.event.args)
    swap.withdrawFee = event.newWithdrawFee.toBigInt()
    await ctx.store.save(swap)

    // let log = new NewWithdrawFeeEvent('new_withdraw_fee-' + event.transaction.hash.toHexString())
    let log = new SwapEvent({ id: 'new_withdraw_fee-' + ctx.event.evmTxHash })
    log.swap = swap
    // log.newFee = event.newWithdrawFee

    log.block = BigInt(ctx.block.height)
    log.timestamp = BigInt(ctx.block.timestamp)
    log.transaction = decodeHex(ctx.event.evmTxHash)

    await ctx.store.save(log)
}

export async function handleRampA(ctx: EvmLogHandlerContext<Store>): Promise<void> {
    let swap = await getOrCreateSwap(ctx)

    const event = SwapNormal.events['RampA(uint256,uint256,uint256,uint256)'].decode(ctx.event.args)

    let log = new SwapEvent({ id: 'ramp_A-' + ctx.event.evmTxHash })

    log.swap = swap

    log.data = new RampAEventData()
    log.data.oldA = event.oldA.toBigInt()
    log.data.newA = event.newA.toBigInt()
    log.data.initialTime = event.initialTime.toBigInt()
    log.data.futureTime = event.futureTime.toBigInt()

    log.block = BigInt(ctx.block.height)
    log.timestamp = BigInt(ctx.block.timestamp)
    log.transaction = decodeHex(ctx.event.evmTxHash)

    await ctx.store.save(log)
}

export async function handleStopRampA(ctx: EvmLogHandlerContext<Store>): Promise<void> {
    let swap = await getOrCreateSwap(ctx)

    const event = SwapNormal.events['StopRampA(uint256,uint256)'].decode(ctx.event.args)
    swap.a = event.currentA.toBigInt()
    await ctx.store.save(swap)

    let log = new SwapEvent({ id: 'stop_ramp_A-' + ctx.event.evmTxHash })

    log.swap = swap

    log.data = new StopRampAEventData()
    log.data.currentA = event.currentA.toBigInt()
    log.data.time = event.time.toBigInt()

    log.block = BigInt(ctx.block.height)
    log.timestamp = BigInt(ctx.block.timestamp)
    log.transaction = decodeHex(ctx.event.evmTxHash)

    await ctx.store.save(log)
}

export async function handleAddLiquidity(ctx: EvmLogHandlerContext<Store>): Promise<void> {
    let swap = await getOrCreateSwap(ctx)
    let balances = await getBalancesSwap(ctx, ctx.event.args.address, swap.numTokens)
    swap.balances = balances

    // update TVL
    let tokens = swap.tokens
    let tvl: BigDecimal = BigDecimal('0')
    for (let i = 0; i < swap.tokens.length; i++) {
        let token = await getOrCreateToken(ctx, toHex(tokens[i].address))
        if (token !== null) {
            let balance = balances[i]
            let balanceDecimal: BigDecimal = BigDecimal(balance.toString()).div(token.decimals.toString())
            tvl = tvl.plus(balanceDecimal)
        }
    }
    swap.tvl = tvl.toFixed()

    let dailyTvl = await getDailyPoolTvl(ctx, swap, BigInt(ctx.block.timestamp))
    dailyTvl.tvl = tvl.toFixed()
    await ctx.store.save(dailyTvl)

    // update APY
    let dailyVolume = await getDailyTradeVolume(ctx, swap, BigInt(ctx.block.timestamp))
    let dailyTotalSwapFees = BigDecimal(dailyVolume.volume).times(swap.swapFee.toString()).div('10000000000')
    let apy: BigDecimal = BigDecimal('0')
    if (!tvl.eq(BigDecimal('0'))) {
        apy = dailyTotalSwapFees.div(tvl).times('365')
    }
    swap.apy = apy.toFixed()

    await ctx.store.save(swap)

    const event = SwapNormal.events['AddLiquidity(address,uint256[],uint256[],uint256,uint256)'].decode(ctx.event.args)

    let log = new SwapEvent({ id: 'add_liquidity-' + ctx.event.evmTxHash })

    log.swap = swap

    log.data = new AddLiquidityEventData()
    log.data.provider = decodeHex(event.provider)
    log.data.tokenAmounts = event.tokenAmounts.map((a) => a.toBigInt())
    log.data.fees = event.fees.map((f) => f.toBigInt())
    log.data.invariant = event.invariant.toBigInt()
    log.data.lpTokenSupply = event.lpTokenSupply.toBigInt()

    log.block = BigInt(ctx.block.height)
    log.timestamp = BigInt(ctx.block.timestamp)
    log.transaction = decodeHex(ctx.event.evmTxHash)

    await ctx.store.save(log)

    // Tuesday, March 29, 2022 12:00:00 PM
    if (ctx.block.timestamp < 1648555200) {
        let airdropee = await getOrCreateAirdropee(ctx, event.provider)
        airdropee.count += 1n
        airdropee.addLiquidityCount += 1n
        airdropee.updated = BigInt(ctx.block.timestamp)
        airdropee.updatedAtBlock = BigInt(ctx.block.height)
        airdropee.updatedAtTransaction = decodeHex(ctx.event.evmTxHash)
        await ctx.store.save(airdropee)
    }
}

export async function handleRemoveLiquidity(ctx: EvmLogHandlerContext<Store>): Promise<void> {
    let swap = await getOrCreateSwap(ctx)
    let balances = await getBalancesSwap(ctx, ctx.event.args.address, swap.numTokens)
    swap.balances = balances

    // update TVL
    let tokens = swap.tokens
    let tvl: BigDecimal = BigDecimal('0')
    for (let i = 0; i < swap.tokens.length; i++) {
        let token = await getOrCreateToken(ctx, toHex(tokens[i].address))
        if (token !== null) {
            let balance = balances[i]
            let balanceDecimal: BigDecimal = BigDecimal(balance.toString()).div(token.decimals.toString())
            tvl = tvl.plus(balanceDecimal)
        }
    }
    swap.tvl = tvl.toFixed()

    let dailyTvl = await getDailyPoolTvl(ctx, swap, BigInt(ctx.block.timestamp))
    dailyTvl.tvl = tvl.toFixed()
    await ctx.store.save(dailyTvl)

    // update APY
    let dailyVolume = await getDailyTradeVolume(ctx, swap, BigInt(ctx.block.timestamp))
    let dailyTotalSwapFees = BigDecimal(dailyVolume.volume).times(swap.swapFee.toString()).div('10000000000')
    let apy: BigDecimal = BigDecimal('0')
    if (!tvl.eq(BigDecimal('0'))) {
        apy = dailyTotalSwapFees.div(tvl).times('365')
    }
    swap.apy = apy.toFixed()

    await ctx.store.save(swap)

    const event = SwapNormal.events['RemoveLiquidity(address,uint256[],uint256)'].decode(ctx.event.args)

    let log = new SwapEvent({ id: 'remove_liquidity-' + ctx.event.evmTxHash })

    log.swap = swap

    log.data = new RemoveLiquidityEventData()
    log.data.provider = decodeHex(event.provider)
    log.data.tokenAmounts = event.tokenAmounts.map((a) => a.toBigInt())
    log.data.lpTokenSupply = event.lpTokenSupply.toBigInt()

    log.block = BigInt(ctx.block.height)
    log.timestamp = BigInt(ctx.block.timestamp)
    log.transaction = decodeHex(ctx.event.evmTxHash)

    await ctx.store.save(log)

    // Tuesday, March 29, 2022 12:00:00 PM
    if (ctx.block.timestamp < 1648555200) {
        let airdropee = await getOrCreateAirdropee(ctx, event.provider)
        airdropee.count += 1n
        airdropee.removeLiquidityCount += 1n
        airdropee.updated = BigInt(ctx.block.timestamp)
        airdropee.updatedAtBlock = BigInt(ctx.block.height)
        airdropee.updatedAtTransaction = decodeHex(ctx.event.evmTxHash)
        await ctx.store.save(airdropee)
    }
}

export async function handleRemoveLiquidityOne(ctx: EvmLogHandlerContext<Store>): Promise<void> {
    let swap = await getOrCreateSwap(ctx)
    let balances = await getBalancesSwap(ctx, ctx.event.args.address, swap.numTokens)
    swap.balances = balances

    // update TVL
    let tokens = swap.tokens
    let tvl: BigDecimal = BigDecimal('0')
    for (let i = 0; i < swap.tokens.length; i++) {
        let token = await getOrCreateToken(ctx, toHex(tokens[i].address))
        if (token !== null) {
            let balance = balances[i]
            let balanceDecimal: BigDecimal = BigDecimal(balance.toString()).div(token.decimals.toString())
            tvl = tvl.plus(balanceDecimal)
        }
    }
    swap.tvl = tvl.toFixed()

    let dailyTvl = await getDailyPoolTvl(ctx, swap, BigInt(ctx.block.timestamp))
    dailyTvl.tvl = tvl.toFixed()
    await ctx.store.save(dailyTvl)

    // update APY
    let dailyVolume = await getDailyTradeVolume(ctx, swap, BigInt(ctx.block.timestamp))
    let dailyTotalSwapFees = BigDecimal(dailyVolume.volume).times(swap.swapFee.toString()).div('10000000000')
    let apy: BigDecimal = BigDecimal('0')
    if (!tvl.eq(BigDecimal('0'))) {
        apy = dailyTotalSwapFees.div(tvl).times('365')
    }
    swap.apy = apy.toFixed()

    await ctx.store.save(swap)

    const event = SwapNormal.events['RemoveLiquidityOne(address,uint256,uint256,uint256,uint256)'].decode(
        ctx.event.args
    )

    let log = new SwapEvent({
        id: 'remove_liquidity_one-' + ctx.event.evmTxHash,
    })

    let tokenAmounts: bigint[] = []
    for (let i = 0; i < swap.numTokens; i++) {
        if (i === event.boughtId.toNumber()) {
            tokenAmounts.push(event.tokensBought.toBigInt())
        } else {
            tokenAmounts.push(0n)
        }
    }

    log.swap = swap

    log.data = new RemoveLiquidityEventData()
    log.data.provider = decodeHex(event.provider)
    log.data.tokenAmounts = tokenAmounts
    log.data.lpTokenSupply = event.lpTokenSupply.toBigInt()

    log.block = BigInt(ctx.block.height)
    log.timestamp = BigInt(ctx.block.timestamp)
    log.transaction = decodeHex(ctx.event.evmTxHash)

    await ctx.store.save(log)

    // Tuesday, March 29, 2022 12:00:00 PM
    if (ctx.block.height < 1648555200) {
        let airdropee = await getOrCreateAirdropee(ctx, event.provider)
        airdropee.count += 1n
        airdropee.removeLiquidityOneCount += 1n
        airdropee.updated = BigInt(ctx.block.timestamp)
        airdropee.updatedAtBlock = BigInt(ctx.block.height)
        airdropee.updatedAtTransaction = decodeHex(ctx.event.evmTxHash)
        await ctx.store.save(airdropee)
    }
}

export async function handleRemoveLiquidityImbalance(ctx: EvmLogHandlerContext<Store>): Promise<void> {
    let swap = await getOrCreateSwap(ctx)
    let balances = await getBalancesSwap(ctx, ctx.event.args.address, swap.numTokens)
    swap.balances = balances

    // update TVL
    let tokens = swap.tokens
    let tvl: BigDecimal = BigDecimal('0')
    for (let i = 0; i < swap.tokens.length; i++) {
        let token = await getOrCreateToken(ctx, toHex(tokens[i].address))
        if (token !== null) {
            let balance = balances[i]
            let balanceDecimal: BigDecimal = BigDecimal(balance.toString()).div(token.decimals.toString())
            tvl = tvl.plus(balanceDecimal)
        }
    }
    swap.tvl = tvl.toFixed()

    let dailyTvl = await getDailyPoolTvl(ctx, swap, BigInt(ctx.block.timestamp))
    dailyTvl.tvl = tvl.toFixed()
    await ctx.store.save(dailyTvl)

    // update APY
    let dailyVolume = await getDailyTradeVolume(ctx, swap, BigInt(ctx.block.timestamp))
    let dailyTotalSwapFees = BigDecimal(dailyVolume.volume).times(swap.swapFee.toString()).div('10000000000')
    let apy: BigDecimal = BigDecimal('0')
    if (!tvl.eq(BigDecimal('0'))) {
        apy = dailyTotalSwapFees.div(tvl).times('365')
    }
    swap.apy = apy.toFixed()

    await ctx.store.save(swap)

    const event = SwapNormal.events['RemoveLiquidityImbalance(address,uint256[],uint256[],uint256,uint256)'].decode(
        ctx.event.args
    )

    let log = new SwapEvent({
        id: 'remove_liquidity_imbalance-' + ctx.event.evmTxHash,
    })

    log.swap = swap

    log.data = new RemoveLiquidityEventData()
    log.data.provider = decodeHex(event.provider)
    log.data.tokenAmounts = event.tokenAmounts.map((a) => a.toBigInt())
    log.data.fees = event.fees.map((f) => f.toBigInt())
    log.data.invariant = event.invariant.toBigInt()
    log.data.lpTokenSupply = event.lpTokenSupply.toBigInt()

    log.block = BigInt(ctx.block.height)
    log.timestamp = BigInt(ctx.block.timestamp)
    log.transaction = decodeHex(ctx.event.evmTxHash)

    await ctx.store.save(log)

    // Tuesday, March 29, 2022 12:00:00 PM
    if (ctx.block.height < 1648555200) {
        let airdropee = await getOrCreateAirdropee(ctx, event.provider)
        airdropee.count += 1n
        airdropee.removeLiquidityImbalanceCount += 1n
        airdropee.updated = BigInt(ctx.block.timestamp)
        airdropee.updatedAtBlock = BigInt(ctx.block.height)
        airdropee.updatedAtTransaction = decodeHex(ctx.event.evmTxHash)
        await ctx.store.save(airdropee)
    }
}

export async function handleTokenSwap(ctx: EvmLogHandlerContext<Store>): Promise<void> {
    let swap = await getOrCreateSwap(ctx)
    let balances = await getBalancesSwap(ctx, ctx.event.args.address, swap.numTokens)
    swap.balances = balances
    await ctx.store.save(swap)

    const event = SwapNormal.events['TokenSwap(address,uint256,uint256,uint128,uint128)'].decode(ctx.event.args)

    if (swap != null) {
        let exchange = new Exchange({
            id: 'token_exchange-' + ctx.event.evmTxHash,
        })

        exchange.swap = swap

        exchange.data = new TokenExchangeData()
        exchange.data.buyer = decodeHex(event.buyer)
        exchange.data.soldId = event.soldId.toBigInt()
        exchange.data.tokensSold = event.tokensSold.toBigInt()
        exchange.data.boughtId = event.boughtId.toBigInt()
        exchange.data.tokensBought = event.tokensBought.toBigInt()

        exchange.block = BigInt(ctx.block.height)
        exchange.timestamp = BigInt(ctx.block.timestamp)
        exchange.transaction = decodeHex(ctx.event.evmTxHash)

        await ctx.store.save(exchange)

        // save trade volume
        let tokens = swap.tokens
        if (event.soldId.toNumber() < tokens.length && event.boughtId.toNumber() < tokens.length) {
            let soldToken = await getOrCreateToken(ctx, toHex(tokens[event.soldId.toNumber()].address))
            let sellVolume = BigDecimal(event.tokensSold.toString()).div(soldToken.decimals.toString())
            let boughtToken = await getOrCreateToken(ctx, toHex(tokens[event.boughtId.toNumber()].address))
            let buyVolume = BigDecimal(event.tokensBought.toString()).div(boughtToken.decimals.toString())
            let volume = sellVolume.plus(buyVolume).div(2)

            let hourlyVolume = await getHourlyTradeVolume(ctx, swap, BigInt(ctx.block.timestamp))
            hourlyVolume.volume = BigDecimal(hourlyVolume.volume).plus(volume).toFixed()
            await ctx.store.save(hourlyVolume)

            let dailyVolume = await getDailyTradeVolume(ctx, swap, BigInt(ctx.block.timestamp))
            dailyVolume.volume = BigDecimal(dailyVolume.volume).plus(volume).toFixed()
            await ctx.store.save(dailyVolume)

            let weeklyVolume = await getWeeklyTradeVolume(ctx, swap, BigInt(ctx.block.timestamp))
            weeklyVolume.volume = BigDecimal(weeklyVolume.volume).plus(volume).toFixed()
            await ctx.store.save(weeklyVolume)

            // update TVL
            let tvl: BigDecimal = BigDecimal('0')
            for (let i = 0; i < swap.tokens.length; i++) {
                let token = await getOrCreateToken(ctx, toHex(tokens[i].address))
                if (token !== null) {
                    let balance: BigInt = balances[i]
                    let balanceDecimal: BigDecimal = BigDecimal(balance.toString()).div(token.decimals.toString())
                    tvl = tvl.plus(balanceDecimal)
                }
            }
            swap.tvl = tvl.toFixed()

            let dailyTvl = await getDailyPoolTvl(ctx, swap, BigInt(ctx.block.timestamp))
            dailyTvl.tvl = tvl.toFixed()
            await ctx.store.save(dailyTvl)

            // update APY
            let dailyTotalSwapFees = BigDecimal(dailyVolume.volume)
                .times(swap.swapFee.toString())
                .div(BigDecimal('10000000000'))
            let apy: BigDecimal = BigDecimal(0)
            if (!tvl.eq(BigDecimal(0))) {
                apy = dailyTotalSwapFees.div(tvl).times(BigDecimal('365'))
            }
            swap.apy = apy.toFixed()

            await ctx.store.save(swap)
        }

        // update system
        let system = await getSystemInfo(ctx)
        system.exchangeCount += 1n
        await ctx.store.save(system)
    }

    // Tuesday, March 29, 2022 12:00:00 PM
    if (ctx.block.height < 1648555200) {
        let airdropee = await getOrCreateAirdropee(ctx, event.buyer) // TODO check correctness of usage "event.buyer"
        airdropee.count += 1n
        airdropee.swapCount += 1n
        airdropee.updated = BigInt(ctx.block.timestamp)
        airdropee.updatedAtBlock = BigInt(ctx.block.height)
        airdropee.updatedAtTransaction = decodeHex(ctx.event.evmTxHash)
        await ctx.store.save(airdropee)
    }
}
