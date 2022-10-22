function createFollower(fields) {
  fetch(`/api/followers/${fields.followee}`, {method: 'POST'})
    .then(showResponse)
    .catch(showResponse);
}

function getFollowers(fields) {
  fetch(`/api/followers/${fields.followee}`)
    .then(showResponse)
    .catch(showResponse);
}

function deleteFollower(fields) {
  fetch(`/api/followers/${fields.followee}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

