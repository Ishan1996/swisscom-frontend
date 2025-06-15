import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/services';

export const getServices = () => {
  return axios.get(API_BASE);
};

export const createService = (data) => {
  return axios.post(API_BASE, data);
};

export const updateService = (id, data) => {
  return axios.put(`${API_BASE}/${id}`, data);
};

export const deleteService = (id) => {
  return axios.delete(`${API_BASE}/${id}`);
};

export const getServiceById = (id) => {
  return axios.get(`${API_BASE}/${id}`);
}
