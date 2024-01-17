// eslint-disable-next-line no-undef
const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_PREFIX = "dev";

export { BASE_URL };

// AUTH
export const LOGIN = `${BASE_URL}/${API_PREFIX}/auth/login`;

// IMAGES
export const IMAGE_UPLOAD = `${BASE_URL}/${API_PREFIX}/image/upload`;
export const IMAGE_DOWNLOAD = `${BASE_URL}/${API_PREFIX}/image/download`;
export const IMAGE_DELETE = `${BASE_URL}/${API_PREFIX}/image/delete`;
export const IMAGE_GET_ALL = `${BASE_URL}/${API_PREFIX}/image/getAll`;
