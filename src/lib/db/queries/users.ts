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

export async function clearUsers() {
  await db.delete(users)
}

export async function getUsers() {
  const allUsers = await db.select().from(users)
  return allUsers
}

