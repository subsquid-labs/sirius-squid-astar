import assert from "assert"
import * as marshal from "./marshal"

export class TokenObject {
  private _address!: Uint8Array
  private _decimals!: bigint
  private _name!: string | undefined | null
  private _symbol!: string | undefined | null

  constructor(props?: Partial<Omit<TokenObject, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._address = marshal.bytes.fromJSON(json.address)
      this._decimals = marshal.bigint.fromJSON(json.decimals)
      this._name = json.name == null ? undefined : marshal.string.fromJSON(json.name)
      this._symbol = json.symbol == null ? undefined : marshal.string.fromJSON(json.symbol)
    }
  }

  get address(): Uint8Array {
    assert(this._address != null, 'uninitialized access')
    return this._address
  }

  set address(value: Uint8Array) {
    this._address = value
  }

  get decimals(): bigint {
    assert(this._decimals != null, 'uninitialized access')
    return this._decimals
  }

  set decimals(value: bigint) {
    this._decimals = value
  }

  get name(): string | undefined | null {
    return this._name
  }

  set name(value: string | undefined | null) {
    this._name = value
  }

  get symbol(): string | undefined | null {
    return this._symbol
  }

  set symbol(value: string | undefined | null) {
    this._symbol = value
  }

  toJSON(): object {
    return {
      address: marshal.bytes.toJSON(this.address),
      decimals: marshal.bigint.toJSON(this.decimals),
      name: this.name,
      symbol: this.symbol,
    }
  }
}
