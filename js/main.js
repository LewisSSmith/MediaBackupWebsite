function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return {
    Authorization: `Bearer ${getToken()}`,
  };
}

function getFileData(id) {
  console.log(`getting data for ${id}`);
  const data = sessionStorage.getItem("file_data_" + id);
  if (data) {
    const x = JSON.parse(data);
    return x;
  }

  return null;
}
