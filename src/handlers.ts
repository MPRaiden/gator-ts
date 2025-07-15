import { setUser } from "./config"

type CommandHandler = (cmdName: string, ...args: string[]) => void

export type CommandsRegistry = Record<string, CommandHandler>

export function handlerLogin(cmdName: string, ...args:string[]) {
  if (!args.length) {
    throw new Error(`function handlerLogin() - expects at least one argument but received - ${args.length}`)
  }

  const userToSet = args[0]

  setUser(userToSet)
  console.log(`User - ${userToSet} has been set\n`)
}

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
  registry[cmdName] = handler
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args:string[]) {
  registry[cmdName](cmdName, ...args)
}
