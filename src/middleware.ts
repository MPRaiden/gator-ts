import { getCurrentUserName } from "./config";
import { getUser } from "./lib/db/queries/users";
import { User } from "./lib/db/schema";

type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

type CommandHandler = (
  cmdName: string,
  userName: string, 
  ...args: string[]
) => Promise<void>;

export type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export function middlewareLoggedIn(handler: UserCommandHandler) {
  return async function cmdHandler(cmdName:string, ...args:string[]) {
    const currUserName = getCurrentUserName()
    const currUser = await getUser(currUserName)
    if (!currUser) {
      throw new Error(`function cmdHandler() - user with username ${currUserName} not found`)
    }

    await handler(cmdName, currUser, ...args)
  }
}

