import fs from "fs";

export type Config = {
  dbUrl: string;
  currentUserName: string;
}

export function setUser(userName: string) {
  console.warn("DEBUGPRINT[59]: config.ts:8: userName=", userName)
  const gatorConfigFile = fs.readFileSync(".gatorconfig.json", "utf8")
  console.warn("DEBUGPRINT[58]: config.ts:9: gatorConfigFile=", gatorConfigFile)

}
