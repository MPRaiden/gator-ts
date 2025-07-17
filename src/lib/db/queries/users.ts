import { sql } from "drizzle-orm"
import { db } from ".."
import { users } from "../schema"

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning()
  return result
}

export async function getUser(name:string) {
  const [foundUser] = await db.select().from(users).where(sql`${users.name} = ${name}`)
  return foundUser
}

