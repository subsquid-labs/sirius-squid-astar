import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Swap} from "./swap.model"

@Entity_()
export class HourlyVolume {
  constructor(props?: Partial<HourlyVolume>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Swap, {nullable: true})
  swap!: Swap

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  timestamp!: bigint

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  volume!: string
}
