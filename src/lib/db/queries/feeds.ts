import { db } from ".."
import { feeds } from "../schema"

export async function createFeed(name:string, url:string, userId:string){
  const [feed] = await db.insert(feeds).values({name:name, url:url, userId:userId}).returning()  
  return feed
}

