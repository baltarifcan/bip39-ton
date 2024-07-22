import { mnemonicNew } from "@ton/crypto";
import check from "./check";

async function main() {
  let counter = 0;
  console.log("Generating cross compliant mnemonic...");
  while (true) {
    const mnemonicTon = await mnemonicNew();
    const mnemonicTonString = mnemonicTon.join(" ");
    const checkResult = check(mnemonicTonString);
    if (checkResult) {
      printMnemonic(mnemonicTonString);
      break;
    }
    counter++;
    if (counter % 500 == 0) {
      console.log("Already tried", counter, "times");
    }
  }
}

main();
