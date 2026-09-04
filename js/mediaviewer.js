let currentModalID = null;
let panzoomInstance = null;

// add html to construct modals
document.getElementById("modalContainer").innerHTML = `
    <div id="imageModal" class="modal hidden">
        <div class="modal-content">

            <button class="closeBtn">✕</button>

            <img id="modalImage" onclick="openFullscreenImage(this.src)">

            <div id="img-details" class="details collapsed"></div>

            <div class="controls">
                <button id="deleteBtn">Delete</button>
                <button id="img-detailsToggle" onclick="toggleDetails('img-details')">Show/Hide</button>
            </div>

        </div>
    </div>

    <div id="videoModal" class="modal hidden">
        <div class="modal-content">

            <button class="closeBtn">✕</button>

            <video id="modalVideo" controls autoplay></video>

            <div id="video-details" class="details collapsed"></div>

            <div class="controls">
                <button id="deleteBtn">Delete</button>
                <button id="video-detailsToggle" onclick="toggleDetails('video-details')">Show/Hide</button>
            </div>

        </div>
    </div>
`;

async function createImageURL(file) {
  const blob = await file.blob();
  return URL.createObjectURL(blob);
}

async function deleteFile(fileId) {
  const response = await fetch(`${CONFIG.API_URL}/delete/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (response.ok) {
    console.log("file deleted");

    closeModal();

    document.getElementById(fileId).remove();
  }
}

function closeModal() {
  console.log("close modal");
  document.getElementById(currentModalID).classList.add("hidden");

  // remove metadata from modal
  document
    .querySelectorAll('[class^="meta-data"]')
    .forEach((el) => el.remove());

  currentModalID = null;
}

// determines correct modal to open, and opens it
function openModal(fileID) {
  const mime = getFileData(fileID).mime;

  if (mime == null) {
    console.log("No mime data! Therefore can't open file.");
    return;
  }

  if (isImageMime(mime)) {
    openImageModal(fileID);
  } else if (isVideoMime(mime)) {
    openVideoModal(fileID);
  } else {
    console.log("Unknown file type! Therefore can't open file.");
  }
}

async function openFullscreenImage(imgURL) {
  const fullscreen_container = document.createElement("div");
  fullscreen_container.id = "fullscreen-container";
  document.body.appendChild(fullscreen_container);
  fullscreen_container.requestFullscreen();

  const fullscreen_image = document.createElement("img");
  fullscreen_image.src = imgURL;
  fullscreen_image.id = "fullscreen-img";

  fullscreen_container.appendChild(fullscreen_image);

  panzoomInstance = Panzoom(fullscreen_image, {
    maxScale: 5,
    minScale: 1,
    contain: "outside",
  });

  // enable pinch-to-zoom on touch devices
  fullscreen_container.addEventListener("wheel", panzoomInstance.zoomWithWheel);

  // reset + cleanup when exiting fullscreen
  document.addEventListener("fullscreenchange", function handler() {
    if (!document.fullscreenElement) {
      panzoomInstance.reset();
      panzoomInstance = null;
      fullscreen_container.remove();
      document.removeEventListener("fullscreenchange", handler);
    }
  });
}

function displayFilename(filename, detailsParentID) {
  const filenameLine = document.createElement("p");
  filenameLine.textContent = filename;
  filenameLine.className = "meta-data";
  document.getElementById(detailsParentID).appendChild(filenameLine);
}

// generates html for displaying file details
function displayMetaData(meta, detailsParentID) {
  if (meta != null) {
    for (const [key, value] of Object.entries(meta)) {
      if (typeof value === "object" && value !== null) {
        // nested
        const line = document.createElement("p");
        line.textContent = key;
        line.className = "meta-data-group";
        document.getElementById(detailsParentID).appendChild(line);
        displayMetaData(value, detailsParentID);
      } else {
        const line = document.createElement("p");
        line.textContent = key + ": " + value;
        line.className = "meta-data";

        document.getElementById(detailsParentID).appendChild(line);
      }
    }
  }
}

function displayDetails(fileID, detailsParentID) {
  const fileData = getFileData(fileID);

  displayFilename(fileData.filename, detailsParentID);
  displayMetaData(fileData.metadata, detailsParentID);
}

async function openImageModal(fileID) {
  currentModalID = "imageModal";
  const modal = document.getElementById("imageModal");
  const img = document.getElementById("modalImage");

  displayDetails(fileID, "img-details");

  img.src = getFileData(fileID).thumbnailURL;

  document.getElementById("deleteBtn").onclick = () => {
    deleteFile(fileID);
  };

  modal.classList.remove("hidden");

  // --- FETCH ORIGINAL FILE ---
  const response = await fetch(`${CONFIG.API_URL}/media/${fileID}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (response.ok) {
    const imgURL = await createImageURL(response);
    img.src = imgURL;
    const fullscreen_img = document.getElementById("fullscreen-img");
    if (fullscreen_img) {
      fullscreen_img.src = imgURL;
    }
  }
}

async function openVideoModal(videoID) {
  currentModalID = "videoModal";
  const modal = document.getElementById("videoModal");
  const vid = document.getElementById("modalVideo");

  displayDetails(videoID, "video-details");

  document.getElementById("deleteBtn").onclick = () => {
    deleteFile(videoID);
  };

  modal.classList.remove("hidden");

  // --- FETCH ORIGINAL FILE ---
  const response = await fetch(`${CONFIG.API_URL}/media/${videoID}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (response.ok) {
    const blob = await response.blob();
    const vidURL = URL.createObjectURL(blob);
    vid.src = vidURL;
  }
}

function toggleDetails(elementId) {
  document.getElementById(elementId).classList.toggle("collapsed");
}

document.querySelectorAll(".closeBtn").forEach((button) => {
  button.addEventListener("click", () => {
    closeModal();
  });
});
