async function addProjectAPI(ProjectName) {
  let token = JSON.parse(sessionStorage.getItem("token"));
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
    },
    body: JSON.stringify({ projectName: ProjectName }),
  };

  return fetch("/test", requestOptions).then((data) => data.json());
}

async function listProjectAPI() {
  let token = JSON.parse(sessionStorage.getItem("token"));
  return fetch("/dashboard", {
    method: "GET",
    headers: { Authorization: `Bearer ${token.access_token}` },
  }).then((data) => data.json());
}
