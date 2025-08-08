import { eq, sql } from "drizzle-orm"
import { db } from ".."
import { posts, feeds } from "../schema"

export async function createPost(title: string, url: string, description: string | null, feedId: string, publishedAt: string) {
  const [post] = await db.insert(posts).values({ title: title, url: url, description: description, feedId: feedId, publishedAt: new Date(publishedAt) }).returning()
  return post
}

export async function getPostsForUser(userId: string, numPosts: number) {
  const userFeeds = await db.select().from(feeds).where(eq(feeds.userId, userId))

  const userPosts = []

  for (const userFeed of userFeeds) {
    const userPost = await db.select().from(posts).where(eq(posts.feedId, userFeed.id)).orderBy(sql`${posts.createdAt} DESC`)
    userPosts.push(...userPost)
  }

  const userPostsByLatest = userPosts.sort((a, b) => Number(b.createdAt) - Number(a.createdAt))

  return userPostsByLatest.slice(0, numPosts)
}

