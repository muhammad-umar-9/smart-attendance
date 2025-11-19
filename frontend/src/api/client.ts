import axios from 'axios';
import { API_BASE_URL } from '../config';

const client = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

export function setAuthToken(token: string | null) {
  if (token) {
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common['Authorization'];
  }
}

export default client;
