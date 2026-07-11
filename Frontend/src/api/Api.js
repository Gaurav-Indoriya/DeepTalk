import axios from "axios";

const API = axios.create({
    baseURL: "https://deeptalk-backend.onrender.com/api/deeptalk",
});

export default API;