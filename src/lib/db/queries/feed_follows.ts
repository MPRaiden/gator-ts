import { and, eq } from "drizzle-orm";
import { db } from "..";
import { feed_follows, feeds, users } from "../schema";


export async function createFeedFollow(userId: string, feedId: string) {
  const [newFeedFollow] = await db.insert(feed_follows).values({ userId, feedId }).returning()

  const [data] = await db.select({ feedFollowsId: feed_follows.id, feedFollowsCreatedAt: feed_follows.createdAt, feedsFollowUserId: feed_follows.userId, feedsFollowFeedId: feed_follows.feedId, feedFollowsUpdatedAt: feed_follows.updatedAt, feedsName: feeds.name, usersName: users.name }).from(feed_follows).where(eq(feed_follows.id, newFeedFollow.id)).innerJoin(feeds, eq(feed_follows.feedId, feeds.id)).innerJoin(users, eq(feed_follows.userId, users.id))

  return data
}

export async function getFeedFollowsForUser(userId: string) {
  const feedFollows = await db.select({ feedName: feeds.name, userName: users.name, feedFollows: feed_follows.id, feedFollowsCreatedAt: feed_follows.createdAt, feedFollowUpdatedAt: feed_follows.updatedAt, feedFollowUserId: feed_follows.userId, feedFollowFeedId: feed_follows.feedId }).from(feed_follows).innerJoin(feeds, eq(feed_follows.feedId, feeds.id)).innerJoin(users, eq(feed_follows.userId, users.id)).where(eq(feed_follows.userId, userId))

  return feedFollows
}

export async function deleteFeedFollow(userId: string, feedURL: string) {
  const [feedIdObj] = await db.select({ feedId: feeds.id }).from(feeds).where(eq(feeds.url, feedURL))
  if (!feedIdObj) {
    throw new Error(`function deleteFeedFollow() - no Feed with URL ${feedURL} found`)
  }

  await db.delete(feed_follows).where(and(eq(feed_follows.userId, userId), eq(feed_follows.feedId, feedIdObj.feedId)))
}
