const recordButton = document.getElementById("recordButton");
const recordIcon = document.getElementById("recordIcon");
const timerDisplay = document.getElementById("timer");

let isRecording = false;
let mediaRecorder;
let audioChunks = [];
let audioContext, analyser, dataArray, source;
let startTime, timerInterval;

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.innerText = formatTime(elapsed);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerDisplay.innerText = "00:00";
}

async function toggleRecording() {
  if (!isRecording) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
    mediaRecorder.start();

    // Áudio context para animar
    audioContext = new AudioContext();
    source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);

    isRecording = true;
    recordButton.classList.remove("idle", "stopping");
    recordButton.classList.add("recording");
    recordIcon.src = "./assets/circle.svg";
    startTimer();
    animateButton();
  } else {
    isRecording = false;
    recordButton.classList.remove("recording");
    recordButton.classList.add("stopping");
    recordButton.style.transform = "scale(1)";
    recordIcon.src = "./assets/stop.svg";

    stopTimer();
    if (audioContext) audioContext.close();
    mediaRecorder.stop();

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.wav");

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      }).catch((err) => console.error("Erro no envio: ", err));

      const json = await res.json();

      alert(`Gravação enviada: ${json.arquivo}`);

      // Volta para inativo
      setTimeout(() => {
        recordButton.classList.remove("stopping");
        recordButton.classList.add("idle");
        recordIcon.src = "./assets/mic.svg";
      }, 1000);
    };
  }
}

function animateButton() {
  if (!isRecording) return;

  requestAnimationFrame(animateButton);
  analyser.getByteFrequencyData(dataArray);

  const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
  const scale = 0.8 + average / 200;
  const glow = 10 + average / 2;

  recordButton.style.transform = `scale(${scale})`;
  recordButton.style.boxShadow = `0 0 ${glow}px rgba(0, 0, 0, 0.6)`;
}

recordButton.addEventListener("click", toggleRecording);
