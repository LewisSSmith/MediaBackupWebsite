function isRaw(fileID) {
  const mime = getFileData(fileID).mime;
  if (mime == "image/x-adobe-dng") {
    return true;
  } else {
    return false;
  }
}

function isVideo(fileID) {
  return getFileData(fileID).mime.startsWith("video");
}

function isImageMime(mime) {
  return mime.startsWith("image");
}

function isVideoMime(mime) {
  return mime.startsWith("video");
}

function getVideoDuration(fileID) {
  try {
    const data = getFileData(fileID).metadata;
    const duration = data.streams[0].duration;
    console.log(duration);
    return Math.round(duration);
  } catch {
    return 0;
  }
}
