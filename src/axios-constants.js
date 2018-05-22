import axios from 'axios';


export default axios.create({
  baseURL: 'https://gsm-constants.firebaseio.com',
  CancelToken: axios.CancelToken,
  timeout: 600000,

});
