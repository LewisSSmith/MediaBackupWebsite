const fileMarkerDatas = new Map();
const map = L.map("map");
const fallbackLocation = [51.5074, -0.1278]; // London
const fallbackZoom = 10;

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
}).addTo(map);

const markers = L.markerClusterGroup({
  iconCreateFunction: function (cluster) {
    const count = cluster.getChildCount();

    return L.divIcon({
      html: `
        <div class="cluster-photo" style="background-image: url('')">
            <span class="cluster-count">${count}</span>
        </div>
        `,
      className: "custom-cluster",
      iconSize: L.point(50, 50),
    });
  },
});

function isMarkerSolo(marker) {
  console.log(markers.getVisibleParent(marker));
  return markers.getVisibleParent(marker) === marker;
}

async function addMarker(data, id) {
  if (isMarkerSolo(data.marker)) {
    if (!data.thumbnailLoaded) {
      const url = await getThumbnail(id);
      if (url) {
        data.thumbnailLoaded = true;
      }
    }

    updateThumbnail(data.marker, data.thumbnailURL);
  }
}

const imageIcon = L.divIcon({
  className: "",
  html: `
        <img
            src=""
            class="photo-marker">
    `,
  iconSize: [48, 48],
});

function plotPhotos(photos) {
  if (!photos || photos.length === 0) {
    document.getElementById("status").textContent = "No photo locations found.";
    return;
  }

  const bounds = [];

  photos.forEach((photo) => {
    const marker = L.marker([photo.latitude, photo.longitude], {
      icon: imageIcon,
      data: photo,
    });

    const data = { marker: marker, thumbnailLoaded: false };

    marker.on("add", () => {
      addMarker(data, photo.id);
    });

    marker.on("click", () => {
      console.log("Marker clicked" + photo.id);
      openModal(photo.id);
    });

    fileMarkerDatas.set(photo.id, data);

    markers.addLayer(marker);
    bounds.push([photo.latitude, photo.longitude]);
  });

  map.addLayer(markers);

  if (bounds.length > 0) {
    map.fitBounds(bounds, { padding: [40, 40] });
  } else {
    map.setView(fallbackLocation, fallbackZoom);
  }

  document.getElementById("status").textContent =
    `${photos.length} photo location(s) shown`;
}

function updateThumbnail(marker, url) {
  const markerElement = marker.getElement();
  // marker might not be rendered yet (e.g. inside a cluster)
  if (!markerElement) return;

  const photoDiv = markerElement.querySelector(".photo-marker");
  if (photoDiv) {
    photoDiv.src = url;
  }
}

async function getThumbnail(fileID) {
  const response = await fetch(`${CONFIG.API_URL}/thumbnail/${fileID}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (response.ok) {
    const blob = await response.blob();
    const thumbnailURL = URL.createObjectURL(blob);
    fileMarkerDatas.get(fileID).thumbnailURL = thumbnailURL;
    return thumbnailURL;
  }
}

async function getData() {
  const response = await fetch(`${CONFIG.API_URL}/locations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    plotPhotos(data);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getData();
});
