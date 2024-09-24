export const UserMenuList = [
  {
    title: "Home",
    url: "/user/user-home",
  },
  {
    title: "About",
    url: "/about",
  },
  {
    title: "Service Providers",
    url: "/user/service-providers",
  },
  {
    title: "Blogs",
    url: "/blogs",
  },
  {
    title: "Contact",
    url: "/contacts",
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
