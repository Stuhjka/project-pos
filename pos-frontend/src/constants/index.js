import butterChicken from '../assets/butter-chicken-4.jpg';
import palakPaneer from '../assets/Saag-Paneer-1.jpg';
import biryani from '../assets/hyderabadibiryani.jpg';
import masalaDosa from '../assets/masala-dosa.jpg';
import choleBhature from '../assets/chole-bhature.jpg';
import rajmaChawal from '../assets/rajma-chawal-1.jpg';
import paneerTikka from '../assets/paneer-tika.webp';
import gulabJamun from '../assets/gulab-jamun.webp';
import pooriSabji from '../assets/poori-sabji.webp';
import roganJosh from '../assets/rogan-josh.jpg';

// --- DATA ORIGINAL LU (JANGAN DIUBAH) ---

export const popularDishes = [
    {
        id: 1,
        image: butterChicken,
        name: 'Butter Chicken',
        numberOfOrders: 250,
    },
    {
        id: 2,
        image: palakPaneer,
        name: 'Palak Paneer',
        numberOfOrders: 190,
    },
    {
        id: 3,
        image: biryani,
        name: 'Hyderabadi Biryani',
        numberOfOrders: 300,
    },
    {
        id: 4,
        image: masalaDosa,
        name: 'Masala Dosa',
        numberOfOrders: 220,
    },
    {
        id: 5,
        image: choleBhature,
        name: 'Chole Bhature',
        numberOfOrders: 270,
    },
    {
        id: 6,
        image: rajmaChawal,
        name: 'Rajma Chawal',
        numberOfOrders: 180,
    },
    {
        id: 7,
        image: paneerTikka,
        name: 'Paneer Tikka',
        numberOfOrders: 210,
    },
    {
        id: 8,
        image: gulabJamun,
        name: 'Gulab Jamun',
        numberOfOrders: 310,
    },
    {
        id: 9,
        image: pooriSabji,
        name: 'Poori Sabji',
        numberOfOrders: 140,
    },
    {
        id: 10,
        image: roganJosh,
        name: 'Rogan Josh',
        numberOfOrders: 160,
    },
]; // udah nggak

export const tables = [
    { id: 1, name: "Table 1", status: "Booked", initial: "AM", seats: 4 },
    { id: 2, name: "Table 2", status: "Available", initial: "MB", seats: 6 },
    { id: 3, name: "Table 3", status: "Booked", initial: "JS", seats: 2 },
    { id: 4, name: "Table 4", status: "Available", initial: "HR", seats: 4 },
    { id: 5, name: "Table 5", status: "Booked", initial: "PL", seats: 3 },
    { id: 6, name: "Table 6", status: "Available", initial: "RT", seats: 4 },
    { id: 7, name: "Table 7", status: "Booked", initial: "LC", seats: 5 },
    { id: 8, name: "Table 8", status: "Available", initial: "DP", seats: 5 },
    { id: 9, name: "Table 9", status: "Booked", initial: "NK", seats: 6 },
    { id: 10, name: "Table 10", status: "Available", initial: "SB", seats: 6 },
    { id: 11, name: "Table 11", status: "Booked", initial: "GT", seats: 4 },
    { id: 12, name: "Table 12", status: "Available", initial: "JS", seats: 6 },
    { id: 13, name: "Table 13", status: "Booked", initial: "EK", seats: 2 },
    { id: 14, name: "Table 14", status: "Available", initial: "QN", seats: 6 },
    { id: 15, name: "Table 15", status: "Booked", initial: "TW", seats: 3 }
];

export const startersItem = [
    { id: 1, name: "Paneer Tikka", price: 45000, rating: "4.9", image: paneerTikka, description: "Keju india bakar rempah" },
    { id: 2, name: "Samosa", price: 15000, rating: "4.5", image: pooriSabji, description: "Gorengan isi kentang & kacang" },
    { id: 3, name: "Chicken Tikka", price: 50000, rating: "4.8", image: roganJosh, description: "Ayam bakar potong dadu" },
];

export const mainCourse = [
    { id: 4, name: "Butter Chicken", price: 60000, rating: "5.0", image: butterChicken, description: "Ayam kuah mentega creamy" },
    { id: 5, name: "Palak Paneer", price: 55000, rating: "4.8", image: palakPaneer, description: "Keju kuah bayam" },
    { id: 6, name: "Hyderabadi Biryani", price: 70000, rating: "4.9", image: biryani, description: "Nasi briyani kambing spesial" },
    { id: 7, name: "Chole Bhature", price: 40000, rating: "4.6", image: choleBhature, description: "Roti goreng dengan kari kacang" },
    { id: 8, name: "Rajma Chawal", price: 35000, rating: "4.5", image: rajmaChawal, description: "Nasi kacang merah" },
];

export const beverages = [
    { id: 9, name: "Masala Chai", price: 20000, rating: "4.7", image: null, description: "Teh tarik rempah India" },
    { id: 10, name: "Lassi", price: 25000, rating: "4.6", image: null, description: "Yoghurt drink manis/asin" },
    { id: 11, name: "Mango Lassi", price: 30000, rating: "4.8", image: null, description: "Lassi rasa mangga segar" },
];

export const soups = [
    { id: 12, name: "Tomato Soup", price: 30000, rating: "4.4", image: null, description: "Sup tomat kental hangat" },
    { id: 13, name: "Sweet Corn Soup", price: 35000, rating: "4.5", image: null, description: "Sup jagung manis creamy" },
];

export const desserts = [
    { id: 14, name: "Gulab Jamun", price: 35000, rating: "4.9", image: gulabJamun, description: "Bola susu goreng sirup gula" },
    { id: 15, name: "Rasgulla", price: 30000, rating: "4.7", image: null, description: "Bola keju kenyal sirup ringan" },
];

export const pizzas = [
    { id: 16, name: "Paneer Pizza", price: 80000, rating: "4.5", image: null, description: "Pizza topping keju india" },
    { id: 17, name: "Chicken Tikka Pizza", price: 90000, rating: "4.8", image: null, description: "Pizza topping ayam tikka" },
];

export const alcoholicDrinks = [
    { id: 18, name: "Kingfisher Beer", price: 50000, rating: "4.2", image: null, description: "Bir premium India" },
    { id: 19, name: "Wine", price: 150000, rating: "4.5", image: null, description: "Anggur merah gelas" },
];

export const salads = [
    { id: 20, name: "Green Salad", price: 25000, rating: "4.3", image: null, description: "Sayuran segar potong" },
    { id: 21, name: "Kachumber Salad", price: 30000, rating: "4.4", image: null, description: "Salad timun tomat bawang pedas" },
];

export const menus = [
    { id: 1, name: "Starters", bgColor: "#b73e3e", icon: "🍲", items: startersItem },
    { id: 2, name: "Main Course", bgColor: "#5b45b0", icon: "🍛", items: mainCourse },
    { id: 3, name: "Beverages", bgColor: "#7f167f", icon: "🍹", items: beverages },
    { id: 4, name: "Soups", bgColor: "#735f32", icon: "🍜", items: soups },
    { id: 5, name: "Desserts", bgColor: "#1d2569", icon: "🍰", items: desserts },
    { id: 6, name: "Pizzas", bgColor: "#285430", icon: "🍕", items: pizzas },
    { id: 7, name: "Alcoholic Drinks", bgColor: "#b73e3e", icon: "🍺", items: alcoholicDrinks },
    { id: 8, name: "Salads", bgColor: "#5b45b0", icon: "🥗", items: salads }
]

// --- DATA DASHBOARD (TUTORIAL) ---
// Gw udah sesuaikan value-nya biar cocok sama mata uang Rupiah

export const metricsData = [
    // 👇 GANTI SYMBOL DI SINI (dari ₹ jadi Rp)
    { title: "Revenue", value: "Rp 50.846.000", percentage: "12%", color: "#025cca", isIncrease: false },
    { title: "Outbound Clicks", value: "10,342", percentage: "16%", color: "#02ca3a", isIncrease: true },
    { title: "Total Customer", value: "19,720", percentage: "10%", color: "#f6b100", isIncrease: true },
    { title: "Event Count", value: "20,000", percentage: "10%", color: "#be3e3f", isIncrease: false },
];

export const itemsData = [
    { title: "Total Categories", value: "8", percentage: "12%", color: "#5b45b0", isIncrease: false },
    { title: "Total Dishes", value: "50", percentage: "12%", color: "#285430", isIncrease: true },
    { title: "Active Orders", value: "12", percentage: "12%", color: "#735f32", isIncrease: true },
    { title: "Total Tables", value: "15", color: "#7f167f" }
];

export const orders = [
    {
        id: "101",
        customer: "Budi Santoso",
        status: "Ready",
        dateTime: "January 18, 2025 08:32 PM",
        items: 8,
        tableNo: 3,
        total: 450000,
    },
    {
        id: "102",
        customer: "Siti Aminah",
        status: "In Progress",
        dateTime: "January 18, 2025 08:45 PM",
        items: 5,
        tableNo: 4,
        total: 180000,
    },
    {
        id: "103",
        customer: "Joko Anwar",
        status: "Ready",
        dateTime: "January 18, 2025 09:00 PM",
        items: 3,
        tableNo: 5,
        total: 120000,
    },
    {
        id: "104",
        customer: "Rina Nose",
        status: "In Progress",
        dateTime: "January 18, 2025 09:15 PM",
        items: 6,
        tableNo: 6,
        total: 220000,
    },
];