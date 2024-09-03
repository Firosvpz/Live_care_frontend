import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:4117",
  withCredentials: true,
});

export default Api;
