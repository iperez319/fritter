function getComments(fields) {
  fetch(`/api/comments?parentId=${fields.parentId}`)
    .then(showResponse)
    .catch(showResponse);
}

function createComment(fields) {
  fetch('/api/comments', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteComment(fields) {
  fetch(`/api/comments/${fields.commentId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
