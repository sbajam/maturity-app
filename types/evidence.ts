// Evidence entity type extracted from a data source during an assessment.
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