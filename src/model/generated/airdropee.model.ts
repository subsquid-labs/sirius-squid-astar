import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Airdropee {
  constructor(props?: Partial<Airdropee>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("bytea", {nullable: false})
  address!: Uint8Array

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  count!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  swapCount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  addLiquidityCount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  removeLiquidityCount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  removeLiquidityImbalanceCount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  removeLiquidityOneCount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  farmDepositCount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  farmWithdrawCount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  farmClaimCount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  updated!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  updatedAtBlock!: bigint

  @Column_("bytea", {nullable: true})
  updatedAtTransaction!: Uint8Array | undefined | null
}
