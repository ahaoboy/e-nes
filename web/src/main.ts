import { createNes, Button } from "../../src";
import nesUrl from "../Island3.nes?url";
import "./style.css";
const getButton = (key: string) => {
  console.log("key", key);
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
    // case 50: // 2
    //   return Button.Joypad2Down;
    // case 52: // 4
    //   return Button.Joypad2Left;
    // case 54: // 6
    //   return Button.Joypad2Right;
    // case 56: // 8
    //   return Button.Joypad2Up;
    case "l": // A
      return Button.Joypad1A;
    case "k": // B
      return Button.Joypad1B;
    // case 82: // R
    //   return Button.Reset;
    case "g": // S
      return Button.Select;
    // case 88: // X
    //   return Button.Joypad2A;
    // case 90: // Z
    //   return Button.Joypad2B;
    default:
      return null;
  }
};
async function init() {
  const canvas = document.getElementById("nes")! as HTMLCanvasElement;
  const nes = await createNes({ rom: nesUrl, canvas });
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

  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;
  // 1024 960
  const s = Math.min(1024 / innerWidth, 960 / innerHeight);
  console.log(s);
}

init();
