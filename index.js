import { GamePad, Event } from "./dist/e-gamepad.esm.js";
const ball = document.getElementById("ball");
const fps = 60;
const pad = new GamePad({ fps });
// pad.onAll((data) => {
//   console.log(data);
// });
const speed = 2;
let x = 0;
let y = 0;
const move = (d = 0) => {
  if (d === 0) {
    // up
    y -= speed;
  } else if (d === 1) {
    // down
    y += speed;
  } else if (d === 2) {
    // left
    x -= speed;
  } else if (d === 3) {
    // right
    x += speed;
  }
  ball.style.left = `${x}px`;
  ball.style.top = `${y}px`;
};

const cb = (data) => {
  data[0].buttons.forEach((i, k) => {
    if (i === Event.Down || i === Event.Press) {
      if (k === 15) {
        move(3);
      } else if (k === 12) {
        move(0);
      } else if (k === 13) {
        move(1);
      } else if (k === 14) {
        move(2);
      }
    }
  });
};
pad.on(Event.Down, (data) => {
  console.log("Down", data);
  cb(data);
});
pad.on(Event.Up, (data) => {
  console.log("up", data);
});
pad.on(Event.Press, (data) => {
  console.log("Press", data);
  cb(data);
});
