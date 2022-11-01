import axios, {AxiosRequestConfig} from "axios";

export const API_URL = `http://localhost:5000/api/1.0.0/`

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

export function makeRequest<T>(url:string, options?:AxiosRequestConfig) {
    return $api<T>(url, options)
        .then(res => res.data)
        .catch(error => Promise.reject(error?.response?.data?.message ?? "Error"))
}

export default $api;