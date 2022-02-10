const st = +new Date();

setTimeout(() => {
  console.log('end', +new Date() - st);
}, 5);
