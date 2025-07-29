import { db } from "..";
import { feed_follows } from "../schema";


export async function createFeedFollow(userId:string, feedId:string) {
  const [newFeedFollow] = await db.insert(feed_follows).values({userId, feedId}).returning()

  return newFeedFollow
}
