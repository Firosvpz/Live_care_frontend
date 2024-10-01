export const UserMenuList = [
  {
    title: "Home",
    url: "/user/user-home",
  },
  {
    title: "About",
    url: "/user/about",
  },
  {
    title: "Blogs",
    url: "/user/blogs",
  },
  {
    title: "Contact",
    url: "/user/contacts",
  },
  {
    title: "Profile",
    url: "",
    submenu: [
      { title: "User-profile", url: "/user/get-profile" },
      { title: "Logout", url: "/logout" },
    ],
  },
];
