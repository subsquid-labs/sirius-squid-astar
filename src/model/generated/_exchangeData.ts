import {TokenExchangeData} from "./_tokenExchangeData"
import {TokenExchangeUnderlyingData} from "./_tokenExchangeUnderlyingData"

export type ExchangeData = TokenExchangeData | TokenExchangeUnderlyingData

export function fromJsonExchangeData(json: any): ExchangeData {
  switch(json?.isTypeOf) {
    case 'TokenExchangeData': return new TokenExchangeData(undefined, json)
    case 'TokenExchangeUnderlyingData': return new TokenExchangeUnderlyingData(undefined, json)
    default: throw new TypeError('Unknown json object passed as ExchangeData')
  }
}
