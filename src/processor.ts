import { lookupArchive } from '@subsquid/archive-registry'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import {
    BatchContext,
    BatchProcessorItem,
    EvmLogEvent,
    SubstrateBatchProcessor,
    SubstrateBlock,
    SubstrateProcessor,
} from '@subsquid/substrate-processor'
import { In } from 'typeorm'
import { ethers } from 'ethers'
import * as SwapNormal from './abi/SwapNormal'
import * as MetaSwap from './abi/SwapNormal'
import * as VotingEscrow from './abi/VotingEscrow'
import * as MetaSwapHandlers from './mappings/metaSwap'
import * as SwapNormalHandlers from './mappings/swapNormal'
import * as VotingEscrowHandlers from './mappings/votingEscrow'
import { handleNewWithdrawFee } from './mappings/swapNormal'

const Sirius4Pool = '0x417E9d065ee22DFB7CC6C63C403600E27627F333'

const database = new TypeormDatabase()
const processor = new SubstrateBatchProcessor()
    .setBatchSize(100)
    .setDataSource({
        archive: lookupArchive('astar', { release: 'FireSquid' }),
        chain: 'wss://rpc.pinknode.io/astar/6e3fa591-e24f-483a-95fa-1d773f7f2be3',
    })

    // Sirius4Pool
    .addEvmLog('0x417E9d065ee22DFB7CC6C63C403600E27627F333'.toLowerCase(), {
        filter: [
            [
                SwapNormal.events['NewAdminFee(uint256)'].topic,
                SwapNormal.events['NewSwapFee(uint256)'].topic,
                SwapNormal.events['NewWithdrawFee(uint256)'].topic,
                SwapNormal.events['RampA(uint256,uint256,uint256,uint256)'].topic,
                SwapNormal.events['StopRampA(uint256,uint256)'].topic,
                SwapNormal.events['AddLiquidity(address,uint256[],uint256[],uint256,uint256)'].topic,
                SwapNormal.events['RemoveLiquidity(address,uint256[],uint256)'].topic,
                SwapNormal.events['RemoveLiquidityImbalance(address,uint256[],uint256[],uint256,uint256)'].topic,
                SwapNormal.events['RemoveLiquidityOne(address,uint256,uint256,uint256,uint256)'].topic,
                SwapNormal.events['TokenSwap(address,uint256,uint256,uint128,uint128)'].topic,
            ],
        ],
        range: {
            from: 815000,
        },
    })
    // Starlay4Pool
    .addEvmLog('0x0fB8C4eB33A30eBb01588e3110968430E3E69D58'.toLowerCase(), {
        filter: [
            [
                SwapNormal.events['NewAdminFee(uint256)'].topic,
                SwapNormal.events['NewSwapFee(uint256)'].topic,
                SwapNormal.events['NewWithdrawFee(uint256)'].topic,
                SwapNormal.events['RampA(uint256,uint256,uint256,uint256)'].topic,
                SwapNormal.events['StopRampA(uint256,uint256)'].topic,
                SwapNormal.events['AddLiquidity(address,uint256[],uint256[],uint256,uint256)'].topic,
                SwapNormal.events['RemoveLiquidity(address,uint256[],uint256)'].topic,
                SwapNormal.events['RemoveLiquidityImbalance(address,uint256[],uint256[],uint256,uint256)'].topic,
                SwapNormal.events['RemoveLiquidityOne(address,uint256,uint256,uint256,uint256)'].topic,
                SwapNormal.events['TokenSwap(address,uint256,uint256,uint128,uint128)'].topic,
            ],
        ],
        range: {
            from: 1049234,
        },
    })
    // nastrPool
    .addEvmLog('0xEEa640c27620D7C448AD655B6e3FB94853AC01e3'.toLowerCase(), {
        filter: [
            [
                SwapNormal.events['NewAdminFee(uint256)'].topic,
                SwapNormal.events['NewSwapFee(uint256)'].topic,
                SwapNormal.events['NewWithdrawFee(uint256)'].topic,
                SwapNormal.events['RampA(uint256,uint256,uint256,uint256)'].topic,
                SwapNormal.events['StopRampA(uint256,uint256)'].topic,
                SwapNormal.events['AddLiquidity(address,uint256[],uint256[],uint256,uint256)'].topic,
                SwapNormal.events['RemoveLiquidity(address,uint256[],uint256)'].topic,
                SwapNormal.events['RemoveLiquidityImbalance(address,uint256[],uint256[],uint256,uint256)'].topic,
                SwapNormal.events['RemoveLiquidityOne(address,uint256,uint256,uint256,uint256)'].topic,
                SwapNormal.events['TokenSwap(address,uint256,uint256,uint128,uint128)'].topic,
            ],
        ],
        range: {
            from: 1501293,
        },
    })
    // oUSDmetapool
    .addEvmLog('0xD18AbE9bcedeb5A9a65439e604b0BE8db0bdB176'.toLowerCase(), {
        filter: [
            [
                MetaSwap.events['NewAdminFee(uint256)'].topic,
                MetaSwap.events['NewSwapFee(uint256)'].topic,
                MetaSwap.events['NewWithdrawFee(uint256)'].topic,
                MetaSwap.events['RampA(uint256,uint256,uint256,uint256)'].topic,
                MetaSwap.events['StopRampA(uint256,uint256)'].topic,
                MetaSwap.events['AddLiquidity(address,uint256[],uint256[],uint256,uint256)'].topic,
                MetaSwap.events['RemoveLiquidity(address,uint256[],uint256)'].topic,
                MetaSwap.events['RemoveLiquidityImbalance(address,uint256[],uint256[],uint256,uint256)'].topic,
                MetaSwap.events['RemoveLiquidityOne(address,uint256,uint256,uint256,uint256)'].topic,
                MetaSwap.events['TokenSwap(address,uint256,uint256,uint128,uint128)'].topic,
            ],
        ],
        range: {
            from: 908500,
        },
    })
    // BAImetapool
    .addEvmLog('0x290c7577D209c2d8DB06F377af31318cE31938fB'.toLowerCase(), {
        filter: [
            [
                MetaSwap.events['NewAdminFee(uint256)'].topic,
                MetaSwap.events['NewSwapFee(uint256)'].topic,
                MetaSwap.events['NewWithdrawFee(uint256)'].topic,
                MetaSwap.events['RampA(uint256,uint256,uint256,uint256)'].topic,
                MetaSwap.events['StopRampA(uint256,uint256)'].topic,
                MetaSwap.events['AddLiquidity(address,uint256[],uint256[],uint256,uint256)'].topic,
                MetaSwap.events['RemoveLiquidity(address,uint256[],uint256)'].topic,
                MetaSwap.events['RemoveLiquidityImbalance(address,uint256[],uint256[],uint256,uint256)'].topic,
                MetaSwap.events['RemoveLiquidityOne(address,uint256,uint256,uint256,uint256)'].topic,
                MetaSwap.events['TokenSwap(address,uint256,uint256,uint128,uint128)'].topic,
            ],
        ],
        range: {
            from: 914000,
        },
    })
    // VotingEscrow
    .addEvmLog('0xc9D383f1e6E5270D77ad8e198729e237b60b6397'.toLowerCase(), {
        filter: [[VotingEscrow.events['Deposit(address,uint256,uint256,int128,uint256)'].topic]],
        range: {
            from: 815000,
        },
    })
    .run(database, async (ctx) => {
        for (const block of ctx.blocks) {
            for (const item of block.items) {
                if (item.name === 'EVM.Log') {
                    switch (item.event.args.address) {
                        case '0x417E9d065ee22DFB7CC6C63C403600E27627F333'.toLowerCase():
                        case '0x0fB8C4eB33A30eBb01588e3110968430E3E69D58'.toLowerCase():
                        case '0xEEa640c27620D7C448AD655B6e3FB94853AC01e3'.toLowerCase():
                            switch (item.event.args.topics[0]) {
                                case SwapNormal.events['NewAdminFee(uint256)'].topic:
                                    await SwapNormalHandlers.handleNewAdminFee({
                                        ...ctx,
                                        block: block.header,
                                        event: item.event,
                                    })
                                    break
                                case SwapNormal.events['NewSwapFee(uint256)'].topic:
                                    await SwapNormalHandlers.handleNewSwapFee({
                                        ...ctx,
                                        block: block.header,
                                        event: item.event,
                                    })
                                    break
                                case SwapNormal.events['NewWithdrawFee(uint256)'].topic:
                                    await SwapNormalHandlers.handleNewWithdrawFee({
                                        ...ctx,
                                        block: block.header,
                                        event: item.event,
                                    })
                                    break
                                case SwapNormal.events['RampA(uint256,uint256,uint256,uint256)'].topic:
                                    await SwapNormalHandlers.handleRampA({
                                        ...ctx,
                                        block: block.header,
                                        event: item.event,
                                    })
                                    break
                                case SwapNormal.events['StopRampA(uint256,uint256)'].topic:
                                    await SwapNormalHandlers.handleStopRampA({
                                        ...ctx,
                                        block: block.header,
                                        event: item.event,
                                    })
                                    break
                                case SwapNormal.events['AddLiquidity(address,uint256[],uint256[],uint256,uint256)']
                                    .topic:
                                    await SwapNormalHandlers.handleAddLiquidity({
                                        ...ctx,
                                        block: block.header,
                                        event: item.event,
                                    })
                                    break
                                case SwapNormal.events['RemoveLiquidity(address,uint256[],uint256)'].topic:
                                    await SwapNormalHandlers.handleRemoveLiquidity({
                                        ...ctx,
                                        block: block.header,
                                        event: item.event,
                                    })
                                    break
                                case SwapNormal.events[
                                    'RemoveLiquidityImbalance(address,uint256[],uint256[],uint256,uint256)'
                                ].topic:
                                    await SwapNormalHandlers.handleRemoveLiquidityImbalance({
                                        ...ctx,
                                        block: block.header,
                                        event: item.event,
                                    })
                                    break
                                case SwapNormal.events['RemoveLiquidityOne(address,uint256,uint256,uint256,uint256)']
                                    .topic:
                                    await SwapNormalHandlers.handleRemoveLiquidityOne({
                                        ...ctx,
                                        block: block.header,
                                        event: item.event,
                                    })
                                    break
                                case SwapNormal.events['TokenSwap(address,uint256,uint256,uint128,uint128)'].topic:
                                    await SwapNormalHandlers.handleTokenSwap({
                                        ...ctx,
                                        block: block.header,
                                        event: item.event,
                                    })
                                    break
                            }
                            break
                        case '0xD18AbE9bcedeb5A9a65439e604b0BE8db0bdB176'.toLowerCase():
                        case '0x290c7577D209c2d8DB06F377af31318cE31938fB'.toLowerCase():
                            switch (item.event.args.topics[0]) {
                                case MetaSwap.events['NewAdminFee(uint256)'].topic:
                                    await MetaSwapHandlers.handleNewAdminFee({
                                        ...ctx,
                                        block: block.header,
                                        event: item.event,
                                    })
                                    break
                                case MetaSwap.events['NewSwapFee(uint256)'].topic:
                                    await MetaSwapHandlers.handleNewSwapFee({
                                        ...ctx,
                                        block: block.header,
                                        event: item.event,
                                    })
                                    break
                                case MetaSwap.events['RampA(uint256,uint256,uint256,uint256)'].topic:
                                    await MetaSwapHandlers.handleRampA({
                                        ...ctx,
                                        block: block.header,
                                        event: item.event,
                                    })
                                    break
                                case MetaSwap.events['StopRampA(uint256,uint256)'].topic:
                                    await MetaSwapHandlers.handleStopRampA({
                                        ...ctx,
                                        block: block.header,
                                        event: item.event,
                                    })
                                    break
                                case MetaSwap.events['AddLiquidity(address,uint256[],uint256[],uint256,uint256)'].topic:
                                    await MetaSwapHandlers.handleAddLiquidity({
                                        ...ctx,
                                        block: block.header,
                                        event: item.event,
                                    })
                                    break
                                case MetaSwap.events['RemoveLiquidity(address,uint256[],uint256)'].topic:
                                    await MetaSwapHandlers.handleRemoveLiquidity({
                                        ...ctx,
                                        block: block.header,
                                        event: item.event,
                                    })
                                    break
                                case MetaSwap.events[
                                    'RemoveLiquidityImbalance(address,uint256[],uint256[],uint256,uint256)'
                                ].topic:
                                    await MetaSwapHandlers.handleRemoveLiquidityImbalance({
                                        ...ctx,
                                        block: block.header,
                                        event: item.event,
                                    })
                                    break
                                case MetaSwap.events['RemoveLiquidityOne(address,uint256,uint256,uint256,uint256)']
                                    .topic:
                                    await MetaSwapHandlers.handleRemoveLiquidityOne({
                                        ...ctx,
                                        block: block.header,
                                        event: item.event,
                                    })
                                    break
                                case MetaSwap.events['TokenSwap(address,uint256,uint256,uint128,uint128)'].topic:
                                    await MetaSwapHandlers.handleTokenSwap({
                                        ...ctx,
                                        block: block.header,
                                        event: item.event,
                                    })
                                    break
                            }
                            break
                        case '0xc9D383f1e6E5270D77ad8e198729e237b60b6397'.toLowerCase():
                            switch (item.event.args.topics[0]) {
                                case VotingEscrow.events['Deposit(address,uint256,uint256,int128,uint256)'].topic:
                                    return VotingEscrowHandlers.handleDeposit({
                                        ...ctx,
                                        block: block.header,
                                        event: item.event,
                                    })
                            }
                            break
                    }
                }
            }
        }
    })
