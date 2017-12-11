import axios from 'axios';


const instance = axios.create({
  baseURL: 'https://burgerbuilder-59ab6.firebaseio.com/'
});

export default instance;