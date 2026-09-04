const username = localStorage.getItem("username");

document.getElementById("title").textContent = `${username}'s Gallary`;

function setProgressBarBlank() {
  document.getElementById("fileUploadStatus").textContent = "Upload file(s)";
  document.getElementById("upload-bar").removeAttribute("value");
}

function setProgressBar(numberUploaded, total) {
  document.getElementById("fileUploadStatus").textContent =
    `Uploaded ${numberUploaded}/${total} files`;
  document.getElementById("upload-bar").value = numberUploaded / total;
}

setProgressBarBlank();

document
  .getElementById("uploadForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById("fileInput");

    const total = fileInput.files.length;
    let numberUploaded = 0;
    let noError = true;

    for (const file of fileInput.files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`${CONFIG.API_URL}/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body: formData,
        });

        if (response.ok) {
          numberUploaded += 1;
          console.log(`Uploaded ${numberUploaded}/${total} files`);
          setProgressBar(numberUploaded, total);
        }
      } catch (err) {
        console.log("ERROR COCOURED:", err);
        noError = false;
      }
    }

    if (noError) {
      window.location.href = "view.html";
    }
  });

// TODO revamp file uploading
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("fileInput");

dropZone.addEventListener("click", () => fileInput.click());

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");

  const droppedFiles = e.dataTransfer.files;
  // sync to the input element
  const dataTransfer = new DataTransfer();
  Array.from(droppedFiles).forEach((file) => dataTransfer.items.add(file));
  fileInput.files = dataTransfer.files;
});
