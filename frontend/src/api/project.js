import axios from 'axios'

const list = () => {
  const user = JSON.parse(localStorage.getItem('user'))

  return axios({
    method: 'get',
    url: process.env.VUE_APP_API + 'projects',
    headers: {
      Authorization: 'Bearer ' + user.token,
    },
  })
    .then(response => {
      return response.data
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

const getOne = async id => {
  const user = JSON.parse(localStorage.getItem('user'))

  return axios({
    method: 'get',
    url: process.env.VUE_APP_API + 'projects/' + id,
    headers: {
      Authorization: 'Bearer ' + user.token,
    },
  })
    .then(response => {
      return response.data
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

const update = async (id, body) => {
  const user = JSON.parse(localStorage.getItem('user'))

  return axios({
    method: 'put',
    url: process.env.VUE_APP_API + 'projects/' + id,
    data: body,
    headers: {
      Authorization: 'Bearer ' + user.token,
    },
  })
    .then(response => {
      return response.data
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

const remove = async (id, body) => {
  const user = JSON.parse(localStorage.getItem('user'))

  return axios({
    method: 'delete',
    url: process.env.VUE_APP_API + 'projects/' + id,
    data: body,
    headers: {
      Authorization: 'Bearer ' + user.token,
    },
  })
    .then(response => {
      return response.data
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

const create = async body => {
  const user = JSON.parse(localStorage.getItem('user'))

  return axios({
    method: 'post',
    url: process.env.VUE_APP_API + 'projects',
    data: body,
    headers: {
      Authorization: 'Bearer ' + user.token,
    },
  })
    .then(response => {
      return response.data
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

export { list, create, getOne, update, remove }
