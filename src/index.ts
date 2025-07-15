import { handlerLogin, registerCommand, runCommand } from "./handlers";

function main() {
  const commandsRegistry = {}
  registerCommand(commandsRegistry, 'login', handlerLogin)

  const args = process.argv
  const userArgs = args.slice(2)

  if (userArgs.length < 1) {
    console.error(`function main() - requires at least one argument but received ${userArgs.length}\n`)
    process.exit(1)
  }

  const commandName = userArgs[0]
  const commArgs = userArgs.slice(1)

  try {
    runCommand(commandsRegistry, commandName, ...commArgs)
  } catch(error) {
    if (error instanceof Error) {
      console.log(`function main() - error messsage:\n${error.message}`)
      process.exit(1)
    } else {
      console.log(`function main() - error:\n${error}`)
      process.exit(1)
    }
  }
}

main()

