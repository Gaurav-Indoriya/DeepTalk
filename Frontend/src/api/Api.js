import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:31098/api/deeptalk",
});

export default API;