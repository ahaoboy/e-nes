#!/usr/bin/env node
import init, { WasmNes, Button } from "../../src/nes-rust/index.js";
import fs from 'fs'
import { encode } from 'ascii-artist'
import cliCursor from 'cli-cursor';
import { init as cvInit, toGray, toThreshold } from 'adaptive-threshold-wasm'
cliCursor.hide();
const getButton = (key) => {
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
const to_threshold = (rgba, width, height) => {
    const gray = toGray(rgba, width, height);
    const threshold = toThreshold(gray, width, height, 255, 0, 0, 7, 3);
    return threshold
}
const sleep = (n) => new Promise(r => setTimeout(r, n))
const keyMap = {}
async function main() {
    const path = process.argv[2];
    await cvInit();

    let width = 256;
    let height = 240;

    const buf = fs.readFileSync(path);
    await init();
    const nes = WasmNes.new();
    nes.set_rom(buf);
    nes.bootup();
    process.stdin.setRawMode(true);
    let prevPress = 0;
    process.stdin.on('data', async keystroke => {
        const now = +new Date()
        if (now - prevPress < 50) {
            return;
        }
        prevPress = now;
        const k = keystroke.toString();
        const button = getButton(k);
        if (button) {
            if (keyMap[button]) {
                clearTimeout(keyMap[button])
            } else {
                nes.press_button(button)
            }
            keyMap[button] = setTimeout(() => {
                nes.release_button(button)
                keyMap[button] = 0
            }, 300)
        }
    });
    const pixel = new Uint8Array(width * height * 4);
    while (true) {
        nes.step_frame();
        nes.update_pixels(pixel);
        const data = to_threshold(pixel, width, height);
        const s = encode(data, width, height).join('\n');
        console.clear();
        console.log(s)
        await sleep(32)
    }
}

main()