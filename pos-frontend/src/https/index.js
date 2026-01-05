import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
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

/**
 * Update Table (Hybrid Function)
 * Bisa menangani dua cara panggil:
 * 1. updateTable(id, payload) -> Digunakan saat Place Order
 * 2. updateTable({ id, payload }) -> Digunakan di Dashboard Admin
 */
export const updateTable = (arg1, arg2) => {
    // Cek jika argumen pertama adalah objek dan punya properti 'id' (Kasus Dashboard Admin)
    if (typeof arg1 === 'object' && arg1.id) {
        return api.put(`/api/table/${arg1.id}`, arg1.payload);
    }
    // Jika argumen pertama adalah ID string (Kasus Place Order)
    return api.put(`/api/table/${arg1}`, arg2);
};

export const deleteTable = (id) => api.delete(`/api/table/${id}`);

// 3. ORDERS
export const addOrder = (data) => api.post("/api/order/", data);
// 👇 SEKARANG BISA TERIMA FILTER (Contoh: { filter: 'today' })
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