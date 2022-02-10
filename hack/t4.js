import fs from "fs";

const a = new Uint8Array(fs.readFileSync("./diff/a.txt"));
const b = new Uint8Array(fs.readFileSync("./diff/b.txt"));
const len = a.length;

let s = new Set();
for (let i = 0; i < len; i++) {
  if (a[i] !== b[1]) {
    s.add(i);
  }
}
console.log(s.size);
