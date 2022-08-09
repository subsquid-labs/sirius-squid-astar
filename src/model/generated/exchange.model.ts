import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Swap} from "./swap.model"
import {ExchangeData, fromJsonExchangeData} from "./_exchangeData"

@Entity_()
export class Exchange {
  constructor(props?: Partial<Exchange>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Swap, {nullable: true})
  swap!: Swap

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : fromJsonExchangeData(obj)}, nullable: true})
  data!: ExchangeData | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  block!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  timestamp!: bigint

  @Column_("bytea", {nullable: false})
  transaction!: Uint8Array
}
