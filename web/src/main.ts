import { createNes, Button, save, load } from "../../src";
import romUrl from "../island_3_cn.nes?url";
// import romUrl from "../ml.nes?url";
import "./style.css";
import { GamePad, Event } from "e-gamepad";
import { set, get } from "idb-keyval";

const isPc = typeof window.orientation !== "number";
const getButton = (key: string) => {
  switch (key) {
    case "h": // space
      return Button.Start;
    case "a": // Left
      return Button.Joypad1Left;
    case "w": // Up
      return Button.Joypad1Up;
    case "d": // Right
      return Button.Joypad1Right;
    case "s": // Down
      return Button.Joypad1Down;
    case "l": // A
      return Button.Joypad1A;
    case "k": // B
      return Button.Joypad1B;
    case "g": // S
      return Button.Select;
    default:
      return null;
  }
};
async function init() {
  const canvas = document.getElementById("nes")! as HTMLCanvasElement;
  const q = new URLSearchParams(location.search).get("rom");
  const { nes, wasm } = await createNes({ rom: q || romUrl, canvas });
  window.setLife = (n) => {
    const b = new Uint8Array(wasm.memory.buffer);
    b[1332212] = n;
  };
  // const snapshotBtn = document.getElementById("snapshot")!;
  // snapshotBtn.addEventListener("click", () => {
  //   const src = wasm.memory.buffer;
  //   const ab = new ArrayBuffer(src.byteLength);
  //   const buf= new Uint8Array(ab)
  //   buf.set(new Uint8Array(src));
  //   for (let i = 0; i < buf.length; i++) {
  //     if (buf[i]) {
  //       console.log(buf[i]);
  //       break;
  //     }
  //   }
  //   const blob = new Blob([buf], { type: "binary" });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.download = url;
  //   a.href = url;
  //   a.click();
  // });
  const pad = new GamePad();
  let checkpoint: number[] = (await get("checkpoint")) || [];
  const checkpointDiv = document.getElementById("checkpoint")!;
  document.getElementById("save")!.addEventListener("click", () => {
    const now = +new Date();
    checkpoint.push(now);
    save(wasm, now + "");
    set("checkpoint", checkpoint);
    renderDiv();
  });

  const renderDiv = () => {
    checkpointDiv.innerHTML = "";
    checkpointDiv.appendChild(getDom());
  };
  const getDom = () => {
    const wrap = new DocumentFragment();
    for (let k = 0; k < checkpoint.length; k++) {
      const i = checkpoint[k];
      const btn = document.createElement("button");
      btn.innerText = isPc ? new Date(i).toLocaleString() : k + "";
      btn.addEventListener("mouseup", (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.button === 2) {
          checkpoint = checkpoint.filter((item) => item !== i);
          renderDiv();
        } else {
          load(wasm, i + "");
        }
      });
      wrap.appendChild(btn);
    }
    return wrap;
  };
  renderDiv();
  window.addEventListener(
    "keydown",
    (event) => {
      event.stopPropagation();
      event.preventDefault();
      const button = getButton(event.key);
      if (button === null) {
        return;
      }
      nes.press_button(button);
    },
    false
  );
  window.addEventListener(
    "keyup",
    (event) => {
      event.stopPropagation();
      event.preventDefault();
      const button = getButton(event.key);
      if (button === null) {
        return;
      }
      nes.release_button(button);
    },
    false
  );

  const padMap: Record<number, string> = {
    12: "w",
    14: "a",
    15: "d",
    13: "s",
    9: "h",
    8: "g",
    2: "k",
    0: "l",
  };
  pad.on(Event.Down, (data) => {
    data[0].buttons.forEach((i, k) => {
      if (i.state === Event.Down) {
        const button = getButton(padMap[k]);
        button && nes.press_button(button);
      }
    });
  });
  pad.on(Event.Up, (data) => {
    data[0].buttons.forEach((i, k) => {
      if (i.state === Event.Up) {
        const button = getButton(padMap[k]);
        button && nes.release_button(button);
      }
    });
  });
  if (isPc) {
    document.getElementById("pad-wrap")!.style.display = "none";
  } else {
    document.getElementById("info")!.style.display = "none";

    for (const i of "wasdghlk") {
      const up = (e: any) => {
        const button = getButton(i);
        if (button === null) {
          return;
        }
        nes.press_button(button);
        e.preventDefault();
      };
      const down = (e: any) => {
        const button = getButton(i);
        if (button === null) {
          return;
        }
        nes.release_button(button);
        e.preventDefault();
      };
      document.getElementById(i)!.addEventListener("touchstart", up);
      document.getElementById(i)!.addEventListener("touchend", down);
      document.getElementById(i)!.addEventListener("mouseup", up);
      document.getElementById(i)!.addEventListener("mousedown", down);
    }
  }
}
const start = () => {
  s.removeEventListener("click", start);
  s.removeEventListener("touchstart", start);
  document.getElementById("app")!.style.display = "flex";
  if (!isPc) {
    document.getElementById("pad-wrap")!.style.display = "flex";
  }
  document.getElementById("start-button")!.style.display = "none";
  window.oncontextmenu = function (e) {
    //取消默认的浏览器自带右键 很重要！！
    e.preventDefault();
  };
  init();
};

const s = document.getElementById("start-button")!;
s.addEventListener("click", start);
s.addEventListener("touchstart", start);
