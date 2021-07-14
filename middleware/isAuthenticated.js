export default function ({ store, redirect }) {
  const token = localStorage.getItem('token')
  if (!token) {
    return redirect('/login')
  }
}
