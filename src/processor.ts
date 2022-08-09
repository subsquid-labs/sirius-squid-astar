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
import { CHAIN_NODE, contractUint8Array, getContractEntity } from './contract'
import { Owner, Token, Transfer } from './model'
import * as SwapNormal from './abi/SwapNormal'
import { handleNewAdminFee, handleNewSwapFee } from './mappings/metaSwap'

const Sirius4Pool = '0x417E9d065ee22DFB7CC6C63C403600E27627F333'

const database = new TypeormDatabase()
const processor = new SubstrateProcessor(database)
    .setBatchSize(500)
    .setDataSource({
        chain: CHAIN_NODE,
        archive: lookupArchive('astar', { release: 'FireSquid' }),
    })
    .addEvmLogHandler(
        Sirius4Pool,
        {
            filter: [[SwapNormal.events['NewAdminFee(uint256)'].topic]],
        },
        handleNewAdminFee
    )
    .addEvmLogHandler(
        Sirius4Pool,
        {
            filter: [SwapNormal.events['NewSwapFee(uint256)'].topic],
        },
        handleNewSwapFee
    )
    .addEvmLogHandler(
        Sirius4Pool,
        {
            filter: [SwapNormal.events['NewWithdrawFee(uint256)'].topic],
        },
        async () => {}
    )
    .addEvmLogHandler(
        Sirius4Pool,
        {
            filter: [SwapNormal.events['RampA(uint256,uint256,uint256,uint256)'].topic],
        },
        async () => {}
    )
    .addEvmLogHandler(
        Sirius4Pool,
        {
            filter: [SwapNormal.events['StopRampA(uint256,uint256)'].topic],
        },
        async () => {}
    )
    .addEvmLogHandler(
        Sirius4Pool,
        {
            filter: [SwapNormal.events['AddLiquidity(address,uint256[],uint256[],uint256,uint256)'].topic],
        },
        async () => {}
    )
    .addEvmLogHandler(
        Sirius4Pool,
        {
            filter: [SwapNormal.events['RemoveLiquidity(address,uint256[],uint256)'].topic],
        },
        async () => {}
    )
    .addEvmLogHandler(
        Sirius4Pool,
        {
            filter: [SwapNormal.events['RemoveLiquidityImbalance(address,uint256[],uint256[],uint256,uint256)'].topic],
        },
        async () => {}
    )
    .addEvmLogHandler(
        Sirius4Pool,
        {
            filter: [SwapNormal.events['RemoveLiquidityOne(address,uint256,uint256,uint256,uint256)'].topic],
        },
        async () => {}
    )
    .addEvmLogHandler(
        Sirius4Pool,
        {
            filter: [SwapNormal.events['TokenSwap(address,uint256,uint256,uint128,uint128)'].topic],
        },
        async () => {}
    )
