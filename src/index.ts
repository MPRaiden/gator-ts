import { setUser } from "./config"
import fs from "fs"
import os from "os"
import path from "path"

function main() {
  setUser("mpr")
  const configFilePath = path.join(os.homedir(), 'playground/gator-ts/.gatorconfig.json')
  const configContents = fs.readFileSync(configFilePath, "utf8")

  console.log(configContents)

}

main()
