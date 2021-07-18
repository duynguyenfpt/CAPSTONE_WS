import { getMe } from '~/service/account'

export default async function ({ store, redirect }) {
  const token = localStorage.getItem('token')
  if (!token) {
    return redirect('/login')
  } else {
    const res = await getMe()
    // eslint-disable-next-line eqeqeq
    if (res.code == 200) {
      const currentUser = {
        username: res.data.username,
        email: res.data.email
      }
      store.commit('auth/setUser', currentUser)
    } else {
      return redirect('/login')
    }
  }
}
