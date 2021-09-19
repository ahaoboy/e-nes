import { createNes, Button } from "../../src";
import romUrl from "../Island3.nes?url";
import "./style.css";

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
  const nes = await createNes({ rom: q || romUrl, canvas });
  window.addEventListener(
    "keydown",
    (event) => {
      const button = getButton(event.key);
      if (button === null) {
        return;
      }
      nes.press_button(button);
      event.preventDefault();
    },
    false
  );
  window.addEventListener(
    "keyup",
    (event) => {
      const button = getButton(event.key);
      if (button === null) {
        return;
      }
      nes.release_button(button);
      event.preventDefault();
    },
    false
  );

  if (isPc) {
    document.getElementById("pad-wrap")!.style.display = "none";
  } else {
    document.getElementById("info")!.style.display = "none";

    for (const i of "wasdghlk") {
      const up = (e:any) => {
        const button = getButton(i);
        if (button === null) {
          return;
        }
        nes.press_button(button);
        e.preventDefault();
      };
      const down = (e:any) => {
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

init();
