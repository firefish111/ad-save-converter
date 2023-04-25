const f = require("fs");
const gz = require("zlib");
const rl = require("readline-sync");

const to_from = rl.keyInSelect([
  "Reality save/automator script to JSON",
  "JSON to Reality save/automator script",
], "Conversion method?", { cancel: false });

console.log("\n");

const saveLoc = rl.question("Where to read the save from? ");
console.log(`Reading save file from ${saveLoc}`);

const start = [
  "AntimatterDimensionsSavefileFormat",
  "AntimatterDimensionsAutomatorScriptFormat",
  "AntimatterDimensionsAutomatorDataFormat",
];

const end = [
  "EndOfSavefile",
  "EndOfAutomatorScript",
  "EndOfAutomatorData",
];

const save_ver = "AAB";
let save = f.readFileSync(saveLoc).toString().trimEnd();
let save_out;

if (to_from === 0) {
  // Reality to JSON

  let type = Array(start.length)
      .fill(false)
      .map((_, ix) => save.startsWith(start[ix]) && save.endsWith(end[ix]))
      .indexOf(true);
 
  if (type === -1) { throw "Invalid save!"; };

  // step 1 - trim header and footer
  save = save.slice(start[type].length + 3, -(end[type].length));  

  // step 2 - filter symbols
  save = save.replace(/0b/g, "+")
             .replace(/0c/g, "/")
             .replace(/0a/g, "0");

  // step 3 - base64 decode
  save = Buffer.from(save, "base64");

  // step 4 - gzip decompress
  save = gz.inflateSync(save).toString();

  save_out = save;
} else if (to_from === 1) {
  // JSON to Reality - opposite of above
  
  let type = rl.keyInSelect(
    start.map(k => k.match(/[A-Z][a-z]+/g).slice(0, -1).join(" ")),
    "What type of data is this?",
    { cancel: false },
  );

  // step 1 - gzip compress
  save = gz.deflateSync(Buffer.from(save));

  // step 2 - base64 encode
  save = save.toString("base64");

  // step 3 - filter symbols
  save = save.replace(/=+$/g, "")
             .replace(/0/g, "0a")
             .replace(/\+/g, "0b")
             .replace(/\//g, "0c");

  // step 4 - add header and footer
  save = start[type] + save_ver + save + end[type];

  save_out = save;
} else { throw "Invalid choice!"; }

let outFile = rl.question("Where to put the output? ");
f.writeFileSync(outFile, save_out);
