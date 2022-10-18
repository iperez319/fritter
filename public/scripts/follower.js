function createFollower(fields) {
    console.log(fields);
  fetch(`/api/followers/${fields['followee']}`, {method: 'POST'})
    .then(showResponse)
    .catch(showResponse);
}

