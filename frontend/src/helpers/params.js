const getParams = params => {
  if (params === undefined) {
    params = ''
  } else {
    var esc = encodeURIComponent

    params =
      '/?' +
      Object.keys(params)

        .map(k => esc(k) + '=' + esc(params[k]))

        .join('&')
  }

  return params
}

export { getParams }
