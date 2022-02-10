import fs from "fs";
import { set } from "idb-keyval";
import path from "path";
// const buf = fs.readFileSync("./mem/0-0-389.txt");
const listToNum = (list) => {
  const a = [...list];
  let r = a[0];
  for (let i = 1; i < a.length; i++) {
    r << (8 + a[i]);
  }
  return r;
};

const listEqual = (list, n) => {
  const a = [...list];
  let r1 = a[0];
  let r2 = a[0];
  for (let i = 1; i < a.length; i++) {
    r << (8 + a[i]);
  }
  return r;
};
const f = (name) => {
  const p = path.join("./", "mem", name);
  const nums = name
    .split(".")[0]
    .split("-")
    .map((i) => parseInt(i));
  console.log(nums);
  const sets = nums.map(() => new Set());
  // const buf = new Int32Array(fs.readFileSync(p));
  const buf = new Uint8Array(fs.readFileSync(p));
  console.log(name, buf[1333160], buf[1333182]);
  for (let i = 0; i < buf.length; i++) {
    for (const k in nums) {
      const n = nums[k];
      for (let len = 1; len <= 8; len++) {
        if (listToNum(buf.slice(i, i + len)) === n) {
          sets[k].add(i);
        }
      }
    }
  }
  return { nums, sets };
};

const hack = () => {
  const fileNames = fs.readdirSync("./mem");
  console.log(fileNames);
  const rets = fileNames.map((n) => f(n));

  const t = rets.map((i) => i["sets"]);
  const c = 2;
  let ts = t[0][c];
  for (let i = 0; i < t.length; i++) {
    const s = t[i];
    console.log(s[c].size);
    ts = new Set([...s[c]].filter((x) => ts.has(x)));
    console.log("ts", ts.size);
  }
  console.log(ts);
};

hack();
