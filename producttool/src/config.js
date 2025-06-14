// src/config.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''; // if you're using Vite
// OR use this if you're using Create React App
// const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export default BASE_URL;
