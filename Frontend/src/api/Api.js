import axios from "axios";

const API = axios.create({
    baseURL: "https://deeptalk-9146.onrender.com/api/deeptalk",
});

export default API;