export const isLoggedIn = () => {
  let data = localStorage.getItem('auth')
  return data != null
}

export const getUser = () => {
  let data = localStorage.getItem('auth')
  return JSON.parse(data)
}

export const doLogin = (user) => {
  localStorage.setItem('auth', JSON.stringify(user))
}

export const doLogout = () => {
  localStorage.removeItem('auth')
}
