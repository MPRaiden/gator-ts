import { eq } from "drizzle-orm";
import { db } from "..";
import { feed_follows, feeds, users } from "../schema";


export async function createFeedFollow(userId:string, feedId:string) {
  const [newFeedFollow] = await db.insert(feed_follows).values({userId, feedId}).returning()
  
  const [data] = await db.select({feedFollowsId: feed_follows.id, feedFollowsCreatedAt: feed_follows.createdAt, feedsFollowUserId: feed_follows.userId, feedsFollowFeedId: feed_follows.feedId, feedFollowsUpdatedAt: feed_follows.updatedAt, feedsName:feeds.name, usersName:users.name}).from(feed_follows).where(eq(feed_follows.id, newFeedFollow.id)).innerJoin(feeds, eq(feed_follows.feedId, feeds.id)).innerJoin(users, eq(feed_follows.userId, users.id))

  return data
}
