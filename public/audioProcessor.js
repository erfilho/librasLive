const audioWorkletProcessor = `
  class AudioRecorderProcessor extends audioWorkletProcessor {
    constructor() {
      super();
      this.buffer = [];
      this.port.onmessage = (event) => {
        if (event.data === "getBuffer") {
          this.port.postMessage(this.buffer);
          this.buffer = [];
        }
      };
    }

    process(inputs) {
      const input = inputs[0];
      if (input && input[0]) {
        this.buffer.push(new Float32Array(input[0]));
      }
      return true;
    }
  }

  registerProcessor("audio-recorder-processor", AudioRecorderProcessor);
`;
