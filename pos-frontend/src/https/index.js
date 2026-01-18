import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        Accept: "application/json",
    }
    
})
console.log("Backend URL yang terbaca:", import.meta.env.VITE_BACKEND_URL);

// 1. AUTH
export const login = (data) => api.post("/api/user/login", data);
export const register = (data) => api.post("/api/user/register", data);
export const getUserData = () => api.get("/api/user");
export const logout = () => api.post("/api/user/logout");

// 2. TABLES
export const addTable = (data) => api.post("/api/table/", data);
export const getTables = () => api.get("/api/table");
export const updateTable = (arg1, arg2) => {
    if (typeof arg1 === 'object' && arg1.id) {
        return api.put(`/api/table/${arg1.id}`, arg1.payload);
    }
    return api.put(`/api/table/${arg1}`, arg2);
};
export const deleteTable = (id) => api.delete(`/api/table/${id}`);

// 3. ORDERS
export const addOrder = (data) => api.post("/api/order/", data);
export const getOrders = (params) => api.get("/api/order", { params });
export const updateOrderStatus = ({ orderId, orderStatus }) => api.put(`/api/order/${orderId}`, { orderStatus });
export const getPopular = () => api.get("/api/order/popular");
export const getDashboardCashier = () => api.get("/api/order/dashboard/cashier");
export const getDashboardAdmin = (params) => api.get("/api/order/dashboard/admin", { params });

// 4. CATEGORY
export const addCategory = (data) => api.post("/api/category", data);
export const getCategories = () => api.get("/api/category");
export const deleteCategory = (id) => api.delete(`/api/category/${id}`);

// 5. DISHES
export const addDish = (data) => api.post("/api/dish", data); 
export const getDishes = () => api.get("/api/dish");
export const deleteDish = (id) => api.delete(`/api/dish/${id}`);
export const updateDish = ({ id, payload }) => api.put(`/api/dish/${id}`, payload);

// 6. GLOBAL SEARCH (FITUR BARU SAKTI)
export const globalSearch = (q) => api.get("/api/search", { params: { q } });