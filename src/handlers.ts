import { getCurrentUserName, setUser } from "./config"
import { createFeedFollow, deleteFeedFollow, getFeedFollowsForUser } from "./lib/db/queries/feed_follows"
import { createFeed, getFeedByUrl, getFeeds, scrapeFeeds } from "./lib/db/queries/feeds"
import { clearUsers, createUser, getUser, getUserById, getUsers } from "./lib/db/queries/users"
import { User } from "./lib/db/schema"
import { printFeed } from "./rss-feed"
import { parseDuration } from "./time"

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>

export type CommandsRegistry = Record<string, CommandHandler>

export async function handlerLogin(cmdName: string, ...args: string[]) {
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

export async function handlerRegister(cmdName: string, ...args: string[]) {
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

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
  await registry[cmdName](cmdName, ...args)
}

export async function handlerReset(cmdName: string, ...args: string[]) {
  await clearUsers()
  process.exit(0)
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
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


export async function handlerAgg(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`function handlerAgg() - expected 1 argument but received ${args.length}`)
  }

  const timeArg = args[0]
  const timeBetweenRequests = parseDuration(timeArg)
  if (!timeBetweenRequests) {
    throw new Error(`function handlerAgg() - timeBetweenRequests is not a valid time value, see - ${timeBetweenRequests}`)
  }

  console.log(`Collecting feeds every ${timeArg}...`);

  // run the first scrape immediately
  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    })
  })
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
  const feeds = await getFeeds()
  for (const feed of feeds) {
    console.log(feed.name)
    console.log(feed.url)
    const feedOwner = await getUserById(feed.userId)
    console.log(feedOwner.name)
  }
}

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
  const currentUserId = user.id
  const feedName = args[0]
  const feedUrl = args[1]

  const createdFeed = await createFeed(feedName, feedUrl, currentUserId)
  const newFeedFollow = await createFeedFollow(currentUserId, createdFeed.id)

  printFeed(createdFeed, user)
  console.log(newFeedFollow.feedsName)
}

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
  const url = args[0]

  const feed = await getFeedByUrl(url)

  const newFeedFollow = await createFeedFollow(user.id, feed.id)

  console.log(`${newFeedFollow.feedsName}\n${newFeedFollow.usersName}\n`)
}

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {
  const userFeedFollows = await getFeedFollowsForUser(user.id)

  for (const feedFollow of userFeedFollows) {
    console.log(feedFollow.feedName)
  }
}

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
  const feedUrl = args[0]

  await deleteFeedFollow(user.id, feedUrl)
}

export function handleError(err: unknown) {
  console.error(
    `function handleError() - Error scraping feeds: ${err instanceof Error ? err.message : err}`,
  );
}

