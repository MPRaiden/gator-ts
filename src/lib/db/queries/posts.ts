import { db } from ".."
import { posts } from "../schema"

export async function createPost(title:string, url:string, description:string | null, feedId: string, publishedAt: string){
  const [post] = await db.insert(posts).values({title:title, url:url, description:description, feedId:feedId, publishedAt: new Date(publishedAt)}).returning()  
  return post 
}

