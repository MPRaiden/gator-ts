import { eq, sql } from "drizzle-orm"
import { db } from ".."
import { feeds } from "../schema"
import { fetchFeed } from "src/rss-feed"

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

export async function markFeedFetched(feedId:string) {
  await db.update(feeds).set({last_fetched_at: new Date(), updatedAt: new Date()}).where(eq(feeds.id, feedId))
}

export async function getNextFeedToFetch() {
  const [feedsByLastFetched] = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.last_fetched_at} NULLS FIRST`)
    .limit(1)
  
  return feedsByLastFetched
}

export async function scrapeFeeds() {
  const nextFeed = await getNextFeedToFetch()
  
  if (!nextFeed) {
    throw new Error(`function scrapeFeeds() - no feed found!`)
  }
  await markFeedFetched(nextFeed.id)

  const feed = await fetchFeed(nextFeed.url)

  for (const item of feed.channel.item) {
    console.log(item.title)
  }
}
