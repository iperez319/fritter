function getVersions(fields) {
  fetch(`/api/versions?parentId=${fields.parentId}`)
    .then(showResponse)
    .catch(showResponse);
}
