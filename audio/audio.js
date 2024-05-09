const uploadBox = document.querySelector(".upload-box"),
  previewAudio = uploadBox.querySelector("audio"),
  fileInput = uploadBox.querySelector("input"),
  qualityInput = document.querySelector(".quality input"),
  downloadBtn = document.querySelector(".download-btn");

const loadFile = (e) => {
  const file = e.target.files[0]; // getting first user selected file
  if (!file) return; // return if user hasn't selected any file
  previewAudio.src = URL.createObjectURL(file); // passing selected file url to preview audio src
  previewAudio.addEventListener("loadedmetadata", () => {
    // once audio metadata is loaded
    const fileSize = Math.floor(file.size / 1024); // file size in KB
    const duration = Math.floor(previewAudio.duration); // audio duration in seconds
    const quality = qualityInput.checked ? "Low" : "High"; // audio quality

    alert(`File Size: ${fileSize} KB\nDuration: ${duration} seconds\nQuality: ${quality}`); // showing file info
  });
}

const compressAndDownload = () => {
  // Get the audio context
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Create a media element source node
  const source = audioContext.createMediaElementSource(previewAudio);

  // Create a compressor node
  const compressor = audioContext.createDynamicsCompressor();
  compressor.threshold.value = -50;
  compressor.knee.value = 40;
  compressor.ratio.value = 12;
  compressor.attack.value = 0;
  compressor.release.value = 0.25;

  // Connect the nodes
  source.connect(compressor);
  compressor.connect(audioContext.destination);

  // Start rendering the compressed audio
  const destination = audioContext.createMediaStreamDestination();
  audioContext.createMediaStreamSource(destination.stream);

  const recorder = new MediaRecorder(destination.stream);
  const chunks = [];
  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'audio/mp3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed_audio.mp3';
    a.click();
    URL.revokeObjectURL(url);
  };

  recorder.start();
  setTimeout(() => recorder.stop(), 3000); // Simulating 3 seconds recording time
}

downloadBtn.addEventListener("click", compressAndDownload);
fileInput.addEventListener("change", loadFile);
uploadBox.addEventListener("click", () => fileInput.click());


downloadBtn.addEventListener("click", compressAndDownload);
fileInput.addEventListener("change", loadFile);
uploadBox.addEventListener("click", () => fileInput.click());
