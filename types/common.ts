// Shared base types: ID, ISO date string, JSON object, and base entity fields.
// =========================================
// Common Types
// =========================================

export type ID = number

export type ISODate = string

export type JsonObject = Record<string, unknown>

export type BaseEntity = {
  id: ID
  createdAt: ISODate
  updatedAt: ISODate
}