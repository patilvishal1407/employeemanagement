const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const getToken = () => localStorage.getItem("token");

const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`, // 👈 add token
      },
    });
    let data;
    try { data = await response.json(); } catch { data = null; }
    if (!response.ok) {
      const message = data?.message || data?.error || response.statusText || `GET ${endpoint} failed`;
      throw new Error(message);
    }
    return data;
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`, // 👈 add token
      },
      body: JSON.stringify(data),
    });
    let json;
    try { json = await response.json(); } catch { json = null; }
    if (!response.ok) {
      const message = json?.message || json?.error || response.statusText || `POST ${endpoint} failed`;
      throw new Error(message);
    }
    return json;
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`, // 👈 add token
      },
      body: JSON.stringify(data),
    });
    let json;
    try { json = await response.json(); } catch { json = null; }
    if (!response.ok) {
      const message = json?.message || json?.error || response.statusText || `PUT ${endpoint} failed`;
      throw new Error(message);
    }
    return json;
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`, // 👈 add token
      },
    });
    let json;
    try { json = await response.json(); } catch { json = null; }
    if (!response.ok) {
      const message = json?.message || json?.error || response.statusText || `DELETE ${endpoint} failed`;
      throw new Error(message);
    }
    return json;
  },
};

export default api;
