import axios from 'axios';

const userApi = axios.create({
  baseURL: import.meta.env.VITE_USER_BASE_URL,
});

export default userApi;
