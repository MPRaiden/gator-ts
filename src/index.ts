import { readConfig, setUser } from "./config";

function main() {
  setUser("mpr");
  const cfg = readConfig();
  console.log(cfg);
}

main();

