import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'

export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
})

export type InsertUser = typeof usersTable.$inferInsert
export type SelectUser = typeof usersTable.$inferSelect
