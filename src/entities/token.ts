import { decodeHex, EvmLogHandlerContext } from '@subsquid/substrate-processor'
import { Store } from '@subsquid/typeorm-store'

import { Token } from '../model'
import { getSystemInfo } from './system'

import * as ERC20 from '../abi/ERC20'

export async function getOrCreateToken(ctx: EvmLogHandlerContext<Store>, address: string): Promise<Token> {
    let token = await ctx.store.get(Token, address)

    if (token == null) {
        let erc20 = new ERC20.Contract(ctx, address)

        let name = await erc20.name()
        let symbol = await erc20.symbol()
        let decimals = await erc20.decimals()

        token = new Token({ id: address })
        token.address = decodeHex(address)
        token.name = name
        token.symbol = symbol
        token.decimals = BigInt(decimals)

        await ctx.store.save(token)

        let system = await getSystemInfo(ctx)
        system.tokenCount += 1n
        await ctx.store.save(system)
    }

    return token as Token
}
