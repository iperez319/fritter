function getReports(fields) {
  fetch(`/api/reports?parentId=${fields.parentId}`)
    .then(showResponse)
    .catch(showResponse);
}

function createReport(fields) {
  fetch('/api/reports', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}
