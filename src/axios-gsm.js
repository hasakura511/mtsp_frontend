import axios from "axios";
import Config from "./AppConfig";

export default axios.create({
  baseURL: Config.API_URL
});
