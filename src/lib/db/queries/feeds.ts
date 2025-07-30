import { eq } from "drizzle-orm"
import { db } from ".."
import { feeds } from "../schema"

export async function createFeed(name:string, url:string, userId:string){
  const [feed] = await db.insert(feeds).values({name:name, url:url, userId:userId}).returning()  
  return feed
}

export async function getFeeds() {
  const allFeeds = await db.select().from(feeds)
  return allFeeds
}

export async function getFeedByUrl(url:string) {
  const [feed] = await db.select().from(feeds).where(eq(feeds.url, url))
  return feed
}
