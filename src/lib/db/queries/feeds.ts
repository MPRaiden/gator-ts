import { eq, sql } from "drizzle-orm"
import { db } from ".."
import { Feed, feeds } from "../schema"
import { fetchFeed } from "src/rss-feed"
import { createPost } from "./posts"

export async function createFeed(name: string, url: string, userId: string) {
  const [feed] = await db.insert(feeds).values({ name: name, url: url, userId: userId }).returning()
  return feed
}

export async function getFeeds() {
  const allFeeds = await db.select().from(feeds)
  return allFeeds
}

export async function getFeedByUrl(url: string) {
  const [feed] = await db.select().from(feeds).where(eq(feeds.url, url))
  return feed
}

export async function markFeedFetched(feedId: string) {
  await db.update(feeds).set({ last_fetched_at: new Date(), updatedAt: new Date() }).where(eq(feeds.id, feedId))
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
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log(`No feeds to fetch.`);
    return;
  }
  console.log(`Found a feed to fetch!`);
  scrapeFeed(feed);
}

export async function scrapeFeed(feed: Feed) {
  await markFeedFetched(feed.id);

  const feedData = await fetchFeed(feed.url);

  for (const feedItem of feedData.channel.item) {
    const pubDateYear = new Date(feedItem.pubDate).getFullYear()

    if (!isNaN(pubDateYear)) {
      await createPost(feedItem.title, feedItem.link, feedItem.description, feed.id, feedItem.pubDate)
    } else {
      await createPost(feedItem.title, feedItem.link, feedItem.description, feed.id, new Date().toDateString())
    }
  }


  console.log(
    `Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`,
  );
}



