import { decodeHex, EvmLogHandlerContext } from '@subsquid/substrate-processor'
import { Store } from '@subsquid/typeorm-store'
import { SystemInfo } from '../model'

export async function getSystemInfo(ctx: EvmLogHandlerContext<Store>): Promise<SystemInfo> {
    let state = await ctx.store.get(SystemInfo, 'current')

    if (state == null) {
        state = new SystemInfo({ id: 'current' })

        state.exchangeCount = 0n
        state.swapCount = 0n
        state.tokenCount = 0n
    }

    state.updated = BigInt(ctx.block.timestamp)
    state.updatedAtBlock = BigInt(ctx.block.height)
    state.updatedAtTransaction = decodeHex(ctx.event.evmTxHash)

    return state as SystemInfo
}
