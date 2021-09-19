const audio = () => {
  class AudioProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
      const output = outputs[0];
      console.log("output", inputs, parameters, outputs);
      output.forEach((channel) => {
        for (let i = 0; i < channel.length; i++) {
          channel[i] = Math.random() * 2 - 1;
        }
      });
      return true;
    }
  }
  console.log(window);
  registerProcessor("audio-processor", AudioProcessor);
};

export default audio;
