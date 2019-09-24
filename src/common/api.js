import axios from 'axios';

export const BASE_URL='/api';
export const LOGIN_ENDPOINT=`${BASE_URL}/auth/login`;
export const WHOAMI_ENDPOINT=`${BASE_URL}/whoami`;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000
});

axios.defaults.withCredentials = true;

export default api;
