import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class SystemInfo {
  constructor(props?: Partial<SystemInfo>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  exchangeCount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  swapCount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  tokenCount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  updated!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  updatedAtBlock!: bigint

  @Column_("bytea", {nullable: false})
  updatedAtTransaction!: Uint8Array
}
