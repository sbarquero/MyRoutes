import axios from 'axios';

const configurationApi = axios.create({
  baseURL: import.meta.env.VITE_CONFIGURATION_BASE_URL,
});

export default configurationApi;
