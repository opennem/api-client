import axios from "axios"

const API_ROOT = process.env.REACT_APP_API_ENDPOINT

const ALLOWED_HOSTS = ["opennem.org.au", "opennem.test"]

const getApiRoot = () => {
  const currentHost = document.location.host
  let apiRoot = API_ROOT

  if (ALLOWED_HOSTS.indexOf(currentHost) >= 0) {
    apiRoot = `//api.${currentHost}`
  }

  console.log(`apiRoot is ${apiRoot}`)

  return apiRoot
}

const agent = axios.create({
  baseURL: getApiRoot(),
  withCredentials: true,
  timeout: 300000,
  validateStatus: function(status) {
    return status >= 200 && status < 403
  },
})

export const handleErrors = err => {
  if (err && err.response && err.response.status === 401) {
    console.error(err)
  }
  return err
}

const requests = {
  get: url => agent.get(url).then(r => r.data),
  post: (url, body) => agent.post(url, body).then(r => r.data),
}

export const api = {
  putRevision: (id, formData) => requests.put(`/revision/{id}`, formData),
  getStations: () => requests.get("/stations?revisions_include=1"),
  getRevisions: () => requests.get("/revisions"),
}
