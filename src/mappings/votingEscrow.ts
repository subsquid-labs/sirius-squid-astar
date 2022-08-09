import { decodeHex, EvmLogHandlerContext } from '@subsquid/substrate-processor'
import { Store } from '@subsquid/typeorm-store'
import { Lock, LockSystemInfo } from '../model'

import * as VotingEscrow from '../abi/VotingEscrow'

export async function handleDeposit(ctx: EvmLogHandlerContext<Store>) {
    let event = VotingEscrow.events['Deposit(Uint8Array,uint256,uint256,int128,uint256)'].decode(ctx.event.args)

    let endTime = event.locktime.toBigInt()
    let beginTime = event.ts.toBigInt()
    if (endTime != 0n && endTime > beginTime) {
        let lockInfo = await getLockInfo(ctx)
        let oldCount = lockInfo.lockCount
        let oldAverage = lockInfo.averageLockTime
        let oldTotal = oldCount * oldAverage

        let lockDuration = endTime - beginTime
        let newTotal = oldTotal + lockDuration
        let newCount = oldCount + 1n
        let newAverage = newTotal / newCount
        lockInfo.lockCount = newCount
        lockInfo.averageLockTime = newAverage
        await ctx.store.save(lockInfo)
    }

    let lock = await getOrCreateLock(ctx, event.provider)
    lock.amount = lock.amount + event.value.toBigInt()
    lock.end = endTime
    await ctx.store.save(lock)
}

export async function getLockInfo(ctx: EvmLogHandlerContext<Store>): Promise<LockSystemInfo> {
    let state = await ctx.store.get(LockSystemInfo, 'current')

    if (state == null) {
        state = new LockSystemInfo({ id: 'current' })

        state.lockCount = 0n
        state.averageLockTime = 0n
    }

    state.updated = BigInt(ctx.block.timestamp)
    state.updatedAtBlock = BigInt(ctx.block.height)
    state.updatedAtTransaction = decodeHex(ctx.event.evmTxHash)

    return state
}

export async function getOrCreateLock(ctx: EvmLogHandlerContext<Store>, address: string): Promise<Lock> {
    let lock = await ctx.store.get(Lock, address)

    if (lock == null) {
        lock = new Lock({ id: address })
        lock.address = decodeHex(address)
        lock.amount = 0n
        lock.end = 0n
        await ctx.store.save(lock)
    }

    return lock
}
