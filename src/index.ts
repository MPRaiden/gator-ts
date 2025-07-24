import { handlerAddFeed, handlerAgg, handlerFeeds, handlerLogin, handlerRegister, handlerReset, handlerUsers, registerCommand, runCommand } from "./handlers";

async function main() {
  const commandsRegistry = {}
  await registerCommand(commandsRegistry, 'login', handlerLogin)
  await registerCommand(commandsRegistry, 'register', handlerRegister)
  await registerCommand(commandsRegistry, 'reset', handlerReset)
  await registerCommand(commandsRegistry, 'users', handlerUsers)
  await registerCommand(commandsRegistry, 'agg', handlerAgg)
  await registerCommand(commandsRegistry, 'addfeed', handlerAddFeed)
  await registerCommand(commandsRegistry, 'feeds', handlerFeeds)

  const args = process.argv
  const userArgs = args.slice(2)

  if (userArgs.length < 1) {
    console.error(`function main() - requires at least one argument but received ${userArgs.length}\n`)
    process.exit(1)
  }

  const commandName = userArgs[0]
  const commArgs = userArgs.slice(1)

  try {
    await runCommand(commandsRegistry, commandName, ...commArgs)
  } catch(error) {
    if (error instanceof Error) {
      console.log(`function main() - error messsage:\n${error.message}`)
      process.exit(1)
    } else {
      console.log(`function main() - error:\n${error}`)
      process.exit(1)
    }
  }

  process.exit(0)
}

await main()

