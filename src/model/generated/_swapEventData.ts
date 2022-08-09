import {NewAdminFeeEventData} from "./_newAdminFeeEventData"
import {NewSwapFeeEventData} from "./_newSwapFeeEventData"
import {NewWithdrawFeeEventData} from "./_newWithdrawFeeEventData"
import {RampAEventData} from "./_rampAEventData"
import {StopRampAEventData} from "./_stopRampAEventData"
import {AddLiquidityEventData} from "./_addLiquidityEventData"
import {RemoveLiquidityEventData} from "./_removeLiquidityEventData"
import {FlashLoanEventData} from "./_flashLoanEventData"

export type SwapEventData = NewAdminFeeEventData | NewSwapFeeEventData | NewWithdrawFeeEventData | RampAEventData | StopRampAEventData | AddLiquidityEventData | RemoveLiquidityEventData | FlashLoanEventData

export function fromJsonSwapEventData(json: any): SwapEventData {
  switch(json?.isTypeOf) {
    case 'NewAdminFeeEventData': return new NewAdminFeeEventData(undefined, json)
    case 'NewSwapFeeEventData': return new NewSwapFeeEventData(undefined, json)
    case 'NewWithdrawFeeEventData': return new NewWithdrawFeeEventData(undefined, json)
    case 'RampAEventData': return new RampAEventData(undefined, json)
    case 'StopRampAEventData': return new StopRampAEventData(undefined, json)
    case 'AddLiquidityEventData': return new AddLiquidityEventData(undefined, json)
    case 'RemoveLiquidityEventData': return new RemoveLiquidityEventData(undefined, json)
    case 'FlashLoanEventData': return new FlashLoanEventData(undefined, json)
    default: throw new TypeError('Unknown json object passed as SwapEventData')
  }
}
