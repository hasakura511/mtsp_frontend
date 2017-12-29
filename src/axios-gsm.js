import axios from "axios";
import Config from "./AppConfig";

const instance = axios.create({
  baseURL: Config.API_URL
});

if (localStorage.getItem("token")) {
  instance.defaults.headers.common["sessiontoken"] = localStorage.getItem(
    "token"
  );
}

export default instance;
