import { pgTable, timestamp, uuid, text, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export type User = typeof users.$inferSelect

export const connectionString = "postgres://mpr:@localhost:5432/gator"

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull(),
  url: text("url").unique().notNull(),
  userId: uuid("user_id").references(() => users.id, {onDelete: 'cascade'}).notNull(),
  last_fetched_at: timestamp("last_fetched_at")
})

export type Feed = typeof feeds.$inferSelect

export const feed_follows = pgTable("feed_follows", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  userId: uuid("user_id").references(() => users.id, {onDelete: 'cascade'}).notNull(),
  feedId: uuid("feed_id").references(() => feeds.id, {onDelete: 'cascade'}).notNull()
}, (table) => [ 
    unique("feed_follow_user_feed_unique").on(table.userId, table.feedId),
])

export type FeedFollow = typeof feed_follows.$inferSelect

