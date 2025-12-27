import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        // 👇 JANGAN DI-HARDCODE JSON DISINI BIAR UPLOAD GAMBAR BISA JALAN
        // "Content-Type": "application/json", 
        Accept: "application/json",
    }
})

// API ENDPOINTS

// 1. AUTH
export const login = (data) => api.post("/api/user/login", data);
export const register = (data) => api.post("/api/user/register", data);
export const getUserData = () => api.get("/api/user");
export const logout = () => api.post("/api/user/logout");

// 2. TABLES
export const addTable = (data) => api.post("/api/table/", data);
export const getTables = () => api.get("/api/table");
// Logic ini aman, ID dikirim di URL, data lain di Body
export const updateTable = ({ tableId, ...tableData }) => api.put(`/api/table/${tableId}`, tableData);
export const deleteTable = (id) => api.delete(`/api/table/${id}`);

// 3. ORDERS (Checkout)
export const addOrder = (data) => api.post("/api/order/", data);
export const getOrders = () => api.get("/api/order");
export const updateOrderStatus = ({ orderId, orderStatus }) => api.put(`/api/order/${orderId}`, { orderStatus });
export const getPopular = () => api.get("/api/order/popular");
export const getDashboardCashier = () => api.get("/api/order/dashboard/cashier");
export const getDashboardAdmin = () => api.get("/api/order/dashboard/admin");


// 4. CATEGORY
export const addCategory = (data) => api.post("/api/category", data);
export const getCategories = () => api.get("/api/category");
export const deleteCategory = (id) => api.delete(`/api/category/${id}`);

// 5. DISHES (Upload Gambar Pake FormData)
export const addDish = (data) => api.post("/api/dish", data); // Axios otomatis tau ini FormData
export const getDishes = () => api.get("/api/dish");
export const deleteDish = (id) => api.delete(`/api/dish/${id}`);

// 👇 TAMBAHIN INI YA MEN (PENTING BUAT EDIT HARGA)
export const updateDish = (data) => api.put(`/api/dish/${data.id}`, data.payload);