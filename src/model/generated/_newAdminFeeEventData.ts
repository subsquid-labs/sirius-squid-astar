import assert from "assert"
import * as marshal from "./marshal"

export class NewAdminFeeEventData {
  public readonly isTypeOf = 'NewAdminFeeEventData'
  private _newFee!: bigint

  constructor(props?: Partial<Omit<NewAdminFeeEventData, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._newFee = marshal.bigint.fromJSON(json.newFee)
    }
  }

  get newFee(): bigint {
    assert(this._newFee != null, 'uninitialized access')
    return this._newFee
  }

  set newFee(value: bigint) {
    this._newFee = value
  }

  toJSON(): object {
    return {
      isTypeOf: this.isTypeOf,
      newFee: marshal.bigint.toJSON(this.newFee),
    }
  }
}
