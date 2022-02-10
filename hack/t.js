const a = new Uint8Array([1, 2, 3]);
console.log(a.toString(2));

const b = [...a].map((i) => i.toString(2).padStart(8, "0")).join('');
console.log(b);
