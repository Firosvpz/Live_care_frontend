import { faHome,faBlog, faUsers, faListAlt, faThLarge, } from "@fortawesome/free-solid-svg-icons"; // Import the needed icons

export const NavList = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: faHome, // Dashboard Icon
  },
  {
    title: "Users",
    path: "/admin/users-list",
    icon: faUsers, // Users Icon
  },
  {
    title: "Service Providers",
    path: "/admin/sp-list",
    icon: faListAlt, // Service Providers Icon
  },
  {
    title: "Categories",
    path: "/admin/categorys-list",
    icon: faThLarge, // Categories Icon
  },
  {
    title: "Blogs",
    path: "/admin/blogs",
    icon: faBlog, // Blog Icon
  },

];
