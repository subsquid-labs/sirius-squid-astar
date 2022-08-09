import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {TokenObject} from "./_tokenObject"
import {SwapEvent} from "./swapEvent.model"
import {Exchange} from "./exchange.model"
import {DailyTvl} from "./dailyTvl.model"
import {HourlyVolume} from "./hourlyVolume.model"
import {DailyVolume} from "./dailyVolume.model"
import {WeeklyVolume} from "./weeklyVolume.model"

@Entity_()
export class Swap {
  constructor(props?: Partial<Swap>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("bytea", {nullable: false})
  address!: Uint8Array

  @Column_("bytea", {nullable: false})
  baseSwapAddress!: Uint8Array

  @Column_("int4", {nullable: false})
  numTokens!: number

  @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => marshal.fromList(obj, val => new TokenObject(undefined, marshal.nonNull(val)))}, nullable: false})
  tokens!: (TokenObject)[]

  @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => marshal.fromList(obj, val => new TokenObject(undefined, marshal.nonNull(val)))}, nullable: false})
  baseTokens!: (TokenObject)[]

  @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => marshal.fromList(obj, val => new TokenObject(undefined, marshal.nonNull(val)))}, nullable: false})
  allTokens!: (TokenObject)[]

  @Column_("numeric", {array: true, nullable: false})
  balances!: (bigint)[]

  @Column_("bytea", {nullable: false})
  lpToken!: Uint8Array

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  a!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  swapFee!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  adminFee!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  withdrawFee!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  virtualPrice!: bigint

  @Column_("bytea", {nullable: false})
  owner!: Uint8Array

  @OneToMany_(() => SwapEvent, e => e.swap)
  events!: SwapEvent[]

  @OneToMany_(() => Exchange, e => e.swap)
  exchanges!: Exchange[]

  @OneToMany_(() => DailyTvl, e => e.swap)
  dailyTvls!: DailyTvl[]

  @OneToMany_(() => HourlyVolume, e => e.swap)
  hourlyVolumes!: HourlyVolume[]

  @OneToMany_(() => DailyVolume, e => e.swap)
  dailyVolumes!: DailyVolume[]

  @OneToMany_(() => WeeklyVolume, e => e.swap)
  weeklyVolumes!: WeeklyVolume[]

  /**
   * BigDecimal
   */
  @Column_('numeric', {nullable: false, precision: 38, scale: 20})
  tvl!: string

  /**
   * BigDecimal
   */
  @Column_('numeric', {nullable: false, precision: 38, scale: 20})
  apy!: string
}
