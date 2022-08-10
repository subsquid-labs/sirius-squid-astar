import { EvmLogHandlerContext } from '@subsquid/substrate-processor'
import { Store } from '@subsquid/typeorm-store'
import { DailyVolume, HourlyVolume, Swap, WeeklyVolume } from '../model'

export async function getHourlyTradeVolume(
    ctx: EvmLogHandlerContext<Store>,
    swap: Swap,
    timestamp: bigint
): Promise<HourlyVolume> {
    let interval = BigInt(60 * 60)
    let day = (timestamp / interval) * interval
    let id = swap.id + '-hour-' + day.toString()

    let volume = await ctx.store.get(HourlyVolume, id)

    if (volume == null) {
        volume = new HourlyVolume({ id })
        volume.swap = swap
        volume.timestamp = day
        volume.volume = '0'
    }

    return volume
}

export async function getDailyTradeVolume(
    ctx: EvmLogHandlerContext<Store>,
    swap: Swap,
    timestamp: bigint
): Promise<DailyVolume> {
    let interval = BigInt(60 * 60 * 24)
    let day = (timestamp / interval) * interval
    let id = swap.id + '-day-' + day.toString()

    let volume = await ctx.store.get(DailyVolume, id)

    if (volume == null) {
        volume = new DailyVolume({ id })
        volume.swap = swap
        volume.timestamp = day
        volume.volume = '0'
    }

    return volume
}

export async function getWeeklyTradeVolume(
    ctx: EvmLogHandlerContext<Store>,
    swap: Swap,
    timestamp: bigint
): Promise<WeeklyVolume> {
    let interval = BigInt(60 * 60 * 24 * 7)
    let day = (timestamp / interval) * interval
    let id = swap.id + '-week-' + day.toString()

    let volume = await ctx.store.get(WeeklyVolume, id)

    if (volume == null) {
        volume = new WeeklyVolume({ id })
        volume.swap = swap
        volume.timestamp = day
        volume.volume = '0'
    }

    return volume
}
