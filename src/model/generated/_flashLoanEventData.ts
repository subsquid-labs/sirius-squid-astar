import assert from "assert"
import * as marshal from "./marshal"

export class FlashLoanEventData {
  public readonly isTypeOf = 'FlashLoanEventData'
  private _receiver!: Uint8Array
  private _tokenIndex!: number
  private _amount!: bigint
  private _amountFee!: bigint
  private _protocolFee!: bigint

  constructor(props?: Partial<Omit<FlashLoanEventData, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._receiver = marshal.bytes.fromJSON(json.receiver)
      this._tokenIndex = marshal.int.fromJSON(json.tokenIndex)
      this._amount = marshal.bigint.fromJSON(json.amount)
      this._amountFee = marshal.bigint.fromJSON(json.amountFee)
      this._protocolFee = marshal.bigint.fromJSON(json.protocolFee)
    }
  }

  get receiver(): Uint8Array {
    assert(this._receiver != null, 'uninitialized access')
    return this._receiver
  }

  set receiver(value: Uint8Array) {
    this._receiver = value
  }

  get tokenIndex(): number {
    assert(this._tokenIndex != null, 'uninitialized access')
    return this._tokenIndex
  }

  set tokenIndex(value: number) {
    this._tokenIndex = value
  }

  get amount(): bigint {
    assert(this._amount != null, 'uninitialized access')
    return this._amount
  }

  set amount(value: bigint) {
    this._amount = value
  }

  get amountFee(): bigint {
    assert(this._amountFee != null, 'uninitialized access')
    return this._amountFee
  }

  set amountFee(value: bigint) {
    this._amountFee = value
  }

  get protocolFee(): bigint {
    assert(this._protocolFee != null, 'uninitialized access')
    return this._protocolFee
  }

  set protocolFee(value: bigint) {
    this._protocolFee = value
  }

  toJSON(): object {
    return {
      isTypeOf: this.isTypeOf,
      receiver: marshal.bytes.toJSON(this.receiver),
      tokenIndex: this.tokenIndex,
      amount: marshal.bigint.toJSON(this.amount),
      amountFee: marshal.bigint.toJSON(this.amountFee),
      protocolFee: marshal.bigint.toJSON(this.protocolFee),
    }
  }
}
