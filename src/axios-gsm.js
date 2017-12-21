import axios from "axios";
import Config from "./AppConfig";

console.log('====================================');
console.log(Config);
console.log('====================================');

export default axios.create({
  baseURL: Config.API_URL
});
