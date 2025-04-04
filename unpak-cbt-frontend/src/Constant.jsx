import axios from "axios";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const baseUrl = "https://seb.unpak.ac.id";

const apiProduction = axios.create({
  baseURL: baseUrl,
});

const apiSelectProduction = axios.create({
    baseURL: "https://sipaksi.unpak.ac.id",
});

apiProduction.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optionally, handle responses if needed
apiProduction.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle token expiry or other 401 errors here
      // Maybe you want to log the user out automatically
    }
    return Promise.reject(error);
  }
);

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return format(date, "iiii, dd MMMM yyyy", { locale: id });
};

export { baseUrl, apiProduction, apiSelectProduction, formatDate };