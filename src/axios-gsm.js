import axios from "axios";
import Config from "./AppConfig";

const instance = axios.create({
  baseURL: Config.API_URL
});

export const axiosOpen = axios.create({
  baseURL: Config.API_URL
})

export default instance;
