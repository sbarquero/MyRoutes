import axios from 'axios';

const trackApi = axios.create({
  baseURL: import.meta.env.VITE_TRACK_BASE_URL,
});

export default trackApi;
