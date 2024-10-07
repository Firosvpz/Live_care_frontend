export const googleLogout = () => {
  const auth2 = window.gapi.auth2.getAuthInstance();
  if (auth2) {
    auth2.signOut().then(() => {
      console.log("User signed out from Google.");
    });
  }
};
