import type {
  BaseEntity,
  ID,
  JsonObject,
} from "./common"

export type Evidence = BaseEntity & {
  assessmentId: ID

  dataSourceId: ID

  title: string

  content: unknown

  context: JsonObject

  metadata: JsonObject
}