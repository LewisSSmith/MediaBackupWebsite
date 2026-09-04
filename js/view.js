const username = localStorage.getItem("username");
let sortBy = "";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sort").addEventListener("change", function () {
    sortBy = this.value;
    clearData();
    getData(this.value);
  });
  sortBy = document.getElementById("sort").value;
  retreiveFilesList(sortBy);
});

document.getElementById("title").textContent = `${username}'s Gallary`;

function generateGroup(id, headingText) {
  const groupDiv = document.createElement("div");
  groupDiv.className = "date-group";
  groupDiv.id = id;

  const groupHeading = document.createElement("h2");
  groupHeading.className = "date-heading";
  groupHeading.textContent = headingText;
  groupDiv.appendChild(groupHeading);

  const groupContentParent = document.createElement("div");
  groupContentParent.className = "thumbnail-content";
  groupDiv.appendChild(groupContentParent);

  document.getElementById("thumbnails").appendChild(groupDiv);

  return groupContentParent;
}

function getDateGroup(fileDate) {
  const date = new Date(fileDate);
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const group = document.getElementById(formattedDate);
  const groupContentParent = group
    ? group.querySelector(".thumbnail-content")
    : generateGroup(formattedDate, formattedDate);

  return groupContentParent;
}

function getThumbnailParent(fileID) {
  //assume upload date for now
  if (sortBy == "uploaded") {
    const uploadDate = getFileData(fileID).uploadedDate;
    return getDateGroup(uploadDate);
  } else if (sortBy == "created") {
    const createdDate = getFileData(fileID).createdDate;
    return getDateGroup(createdDate);
  } else if (sortBy == "size") {
    const group = document.getElementById("untitled-thumbnail-content");
    if (group) {
      return group;
    } else {
      const groupContent = document.createElement("div");
      groupContent.className = "thumbnail-content";
      groupContent.id = "untitled-thumbnail-content";

      document.getElementById("thumbnails").appendChild(groupContent);

      return groupContent;
    }
  }
}

async function addThumbnail(fileID) {
  const img_box = document.createElement("div");
  img_box.className = "img-box";
  img_box.id = fileID;
  img_box.dataset.fileID = fileID;

  img_box.addEventListener("click", () => {
    openModal(fileID);
  });

  const img = document.createElement("img");
  img.src = getFileData(fileID).thumbnailURL;
  img_box.appendChild(img);

  if (isVideo(fileID)) {
    // adds video badge
    const videoBadge = document.createElement("div");
    videoBadge.className = "video-badge";

    videoBadge.innerHTML = `
                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <span>${getVideoDuration(fileID)}</span>
                `;

    img_box.appendChild(videoBadge);
  }

  getThumbnailParent(fileID).appendChild(img_box);
}

function clearData() {
  fileDatas.clear();
  document.getElementById("thumbnails").innerHTML = "";
}

async function retreiveFile(fileData) {
  const fileID = fileData.id;

  const response = await fetch(`${CONFIG.API_URL}/thumbnail/${fileID}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (response.ok) {
    const blob = await response.blob();
    const thumbnailURL = URL.createObjectURL(blob);
    console.log(`Loaded file ${fileID}`);

    const data = {
      thumbnailURL: thumbnailURL,
      mime: fileData.mime,
      filename: fileData.filename,
      uploadedDate: fileData.date_uploaded,
      createdDate: fileData.date_created,
      size: fileData.createdDate,
      metadata: fileData.metadata,
    };
    sessionStorage.setItem("file_data_" + fileID, JSON.stringify(data));

    await addThumbnail(fileID);
  }
}

async function retreiveFilesList(sortBy) {
  const params = new URLSearchParams();

  // TODO add controls to these params
  //params.append("limit", 12);
  params.append("sort", sortBy);
  params.append("direction", "desc");

  const response = await fetch(`${CONFIG.API_URL}/file-request?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (response.status == 401) {
    // unortharized, so redirect to login
    window.location.href = "login.html";
  } else if (response.ok) {
    const fileList = await response.json();

    for (const fileData of fileList) {
      await retreiveFile(fileData);
    }
  }
}
