"use strict";

const copyButton = document.querySelector("#copy-bibtex");
copyButton.addEventListener("click", async () => {
  const code = document.querySelector("#bibtex-code");
  const status = document.querySelector("#copy-status");
  try {
    await navigator.clipboard.writeText(code.textContent);
    status.textContent = "Citation copied.";
  } catch {
    const range = document.createRange();
    range.selectNodeContents(code);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = "Citation selected. Press Ctrl+C or ⌘C to copy.";
  }
});

// Keep spoken presentations from playing over one another.
const videos = [...document.querySelectorAll("video")];
videos.forEach(video => video.addEventListener("play", () => {
  videos.forEach(other => { if (other !== video) other.pause(); });
}));
