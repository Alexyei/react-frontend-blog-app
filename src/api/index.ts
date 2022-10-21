import axios from "axios";

export const API_URL = `http://localhost:5000/api/1.0.0/`

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

export default $api;