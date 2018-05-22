import axios from "axios";
import Config from "./AppConfig";

const instance = axios.create({
  baseURL: Config.API_URL,
  timeout: 600000,
});

export const axiosOpen = axios.create({
  baseURL: Config.API_URL,
  timeout: 600000,
})

export default instance;
