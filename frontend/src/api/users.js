import axios from 'axios'

const login = async body => {
  return axios({
    method: 'post',
    url: process.env.VUE_APP_API + 'users/login',
    data: body,
  })
    .then(response => {
      localStorage.setItem('user', JSON.stringify(response.data.user))
      return response.data
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

const register = async body => {
  return axios({
    method: 'post',
    url: process.env.VUE_APP_API + 'users',
    data: body,
  })
    .then(response => {
      return response.data
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

const logout = async () => {
  var user = JSON.parse(localStorage.getItem('user'))

  return axios({
    method: 'get',
    url: process.env.VUE_APP_API + 'users/logout',
    headers: {
      Authorization: 'Bearer ' + user.token,
    },
  })
    .then(response => {
      localStorage.removeItem('user')
      return response
    })
    .catch(error => {
      localStorage.removeItem('user')
      return Promise.reject(error)
    })
}

const checkToken = async () => {
  const user = JSON.parse(localStorage.getItem('user'))

  if (user) {
    return axios({
      method: 'get',
      url: process.env.VUE_APP_API + 'users/checkToken',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.token,
      },
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        return Promise.reject(error)
      })
  } else {
    return Promise.reject('Token null')
  }
}

export { login, logout, register, checkToken }
