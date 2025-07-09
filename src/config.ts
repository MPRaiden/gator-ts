import fs from "fs";
import os from "os"
import path from "path"

export type Config = {
  dbUrl: string;
  currentUserName: string;
}

export function setUser(userName: string) {
  const gatorConfigFile = fs.readFileSync(".gatorconfig.json", "utf8")
  const gatorConfigObj = JSON.parse(gatorConfigFile)

  const newConfig: Config = {
    dbUrl: gatorConfigObj.db_url,
    currentUserName: userName
  }


  const pathToWrite = path.join(os.homedir(), 'playground/gator-ts/.gatorconfig.json')
  fs.writeFileSync(pathToWrite, JSON.stringify(newConfig))
}
