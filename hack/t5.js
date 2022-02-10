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

const findAllIndex = (stringValue, substr) => {
  var positions = new Array();
  var pos = stringValue.indexOf(substr);
  while (pos > -1) {
    positions.push(pos);
    pos = stringValue.indexOf(substr, pos + 1);
  }
  return positions;
};

const f = (name) => {
  const p = path.join("./", "mem3", name);
  const nums = name
    .split(".")[0]
    .split("-")
    .map((i) => parseInt(i));
  console.log(nums);
  const sets = nums.map(() => new Set());
  // const buf = new Int32Array(fs.readFileSync(p));
  const buf = new Uint8Array(fs.readFileSync(p));
  // const time = nums[0].toString(2).padStart(8, "0");
  // const b = [...buf].map((i) => i.toString(2).padStart(8, "0")).join("");
  // console.log("x:", nums[0], time, b.slice(0, 100));
  // console.log(b.includes(time));
  // const pos = findAllIndex(b, time);
  // console.log("pos", pos.length);
  // sets[0] = new Set(pos);

  console.log(name, buf[1332212], buf[1332212]);
  for (let i = 0; i < buf.length; i++) {
    for (const k in nums) {
      const n = nums[k];
      if (buf[i] === n) {
        sets[k].add(i);
      }
      // for (let len = 1; len <= 8; len++) {
      // if (listToNum(buf.slice(i, i + len)) === n) {
      // sets[k].add(i);
      // }
      // }
    }
  }
  return { nums, sets };
};

const hack = () => {
  const fileNames = fs.readdirSync("./mem3");
  console.log(fileNames);
  const rets = fileNames.map((n) => f(n));
  const t = rets.map((i) => i["sets"]);
  const c = 0;
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
