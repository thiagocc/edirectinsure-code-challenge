export default [
  {
    name: 'GENERIC_CRUD_ERROR',
    callback: function(e) {
      if (e.hasOwnProperty('response')) {
        window.getApp.snackbar = {
          show: true,
          color: 'red',
          text: e.response.data.error.hasOwnProperty('message')
            ? e.response.data.error.message
            : e.response.data.error,
        }
      } else if (e.hasOwnProperty('error')) {
        window.getApp.snackbar = {
          show: true,
          color: 'red',
          text: e.rror,
        }
      } else {
        window.getApp.snackbar = {
          show: true,
          color: 'red',
          text: process.env.VUE_APP_ENVIRONMENT === 'DEV' ? e : 'Error :/',
        }
      }
    },
  },
  {
    name: 'GENERIC_SUCCESS',
    callback: e => {
      window.getApp.snackbar = {
        show: true,
        color: 'green',
        text: e,
      }
    },
  },
]
