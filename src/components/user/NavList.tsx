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
    title: "Bookings",
    url: "/user/get-bookings",
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
