export default function ({ store, redirect }) {
  // If the user is authenticated redirect to home page
  if (store.state.auth) {
    if (store.state.roles.has("admin")) return redirect("/admin");
    return redirect("/employee");
  } else return redirect("/login");
}
