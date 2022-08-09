import { EvmLogHandlerContext } from '@subsquid/substrate-processor'
import { Store } from '@subsquid/typeorm-store'
import { DailyTvl, Swap } from '../model'

export async function getDailyPoolTvl(
    ctx: EvmLogHandlerContext<Store>,
    swap: Swap,
    timestamp: bigint
): Promise<DailyTvl> {
    let interval = BigInt(60 * 60 * 24)
    let day = (timestamp / interval) * interval
    let id = swap.id + '-day-' + day.toString()

    let tvl = await ctx.store.get(DailyTvl, id)

    if (tvl == null) {
        tvl = new DailyTvl({ id })
        tvl.swap = swap
        tvl.timestamp = day
        tvl.tvl = '0'
    }

    return tvl
}
