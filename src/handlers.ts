import { getCurrentUserName, setUser } from "./config"
import { createFeed } from "./lib/db/queries/feeds"
import { clearUsers, createUser, getUser, getUsers } from "./lib/db/queries/users"
import { fetchFeed, printFeed } from "./rss-feed"

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>

export type CommandsRegistry = Record<string, CommandHandler>

export async function handlerLogin(cmdName: string, ...args:string[]) {
  if (!args.length) {
    throw new Error(`function handlerLogin() - expects at least one argument but received - ${args.length}`)
  }

  const userToSet = args[0]
  // Check if user exists in db
  const foundUser = await getUser(userToSet)
  if (!foundUser) {
    throw new Error(`function handlerLogin() - there is no user with ${userToSet} in the database, please double check`)
  }

  setUser(userToSet)
  console.log(`function handlerLogin() - User ${userToSet} has been set\n`)
}

export async function handlerRegister(cmdName:string, ...args:string[]) {
  if (!args.length) {
    throw new Error(`function handlerRegister() - expects at least one argument but received - ${args.length}`)
  }

  const userName = args[0]
  const existingUser = await getUser(userName)
  if (existingUser) {
    throw new Error(`function handlerRegister() - user with name ${userName} already exists`)
  }
  
  await createUser(userName)
  setUser(userName)

  console.log(`function handlerRegister() - created and set new user ${userName}`)
}

export async function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
  registry[cmdName] = handler
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args:string[]) {
  await registry[cmdName](cmdName, ...args)
}

export async function handlerReset(cmdName: string, ...args:string[]) {
  await clearUsers()
  process.exit(0)
}

export async function handlerUsers(cmdName:string, ...args:string[]) {
  const loggedInUser = getCurrentUserName()
  const users = await getUsers()
  for (const user of users) {
    if (loggedInUser === user.name) {
      console.log(`* ${user.name} (current)\n`)
    } else {
      console.log(`* ${user.name}\n`)
    }
  }
}

export async function handlerAgg(cmdName: string, ...args:string[]) {
  const singleFeed = await fetchFeed("https://www.wagslane.dev/index.xml")
  console.log(JSON.stringify(singleFeed))
}

export async function handlerAddFeed(cmdName: string, ...args:string[]) {
  const currentUserName = getCurrentUserName()
  const currentUser = await getUser(currentUserName)
  const currentUserId = currentUser.id
  const feedName = args[0]
  const feedUrl = args[1]

  const createdFeed = await createFeed(feedName, feedUrl, currentUserId)

  printFeed(createdFeed, currentUser)
}


