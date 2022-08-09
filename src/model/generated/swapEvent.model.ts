import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Swap} from "./swap.model"
import {SwapEventData, fromJsonSwapEventData} from "./_swapEventData"

@Entity_()
export class SwapEvent {
  constructor(props?: Partial<SwapEvent>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Swap, {nullable: true})
  swap!: Swap

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : fromJsonSwapEventData(obj)}, nullable: true})
  data!: SwapEventData | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  block!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  timestamp!: bigint

  @Column_("bytea", {nullable: false})
  transaction!: Uint8Array
}
