export const isLoggedIn = () => {
  let data = localStorage.getItem('auth')
  return data != null
}

export const doLogin = (user) => {
  localStorage.setItem('auth', JSON.stringify(user))
}

export const doLogout = () => {
  localStorage.removeItem('auth')
}
