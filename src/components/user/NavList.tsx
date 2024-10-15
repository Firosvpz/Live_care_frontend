export const UserMenuList = [
  {
    title: "Home",
    url: "/user/user-home",
  },
  {
    title: "Main",
    submenu: [
      {
        title: "About",
        url: "/user/about",
      },
      {
        title: "Blogs",
        url: "/user/blogs",
      },
      {
        title: "Service Providers",
        url: "/user/service-providers",
      },
    ],
  },
  {
    title: "Bookings",
    submenu: [
      {
        title: "Bookings",
        url: "/user/get-bookings",
      },
     
    ],
  },
  {
    title: "Support",
    submenu: [
      {
        title: "Complaints",
        url: "/user/complaints",
      },
      {
        title: "Contact",
        url: "/user/contacts",
      },
    ],
  },
  {
    title: "Profile",
    submenu: [
      { title: "User-profile", url: "/user/get-profile" },
      { title: "Logout", url: "/logout" },
    ],
  },
];
