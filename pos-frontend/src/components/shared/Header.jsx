import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserCircle, FaUtensils, FaUserAlt, FaLayerGroup } from "react-icons/fa"
import logo from '../../assets/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { IoLogOut } from 'react-icons/io5';
import { useMutation } from '@tanstack/react-query';
import { removeUser } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router';
import { logout, globalSearch } from '../../https';
import { MdDashboard } from 'react-icons/md';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState({ dishes: [], orders: [], categories: [] });
  const [showDropdown, setShowDropdown] = useState(false);

  const userData = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // FUNGSI NAVIGASI: Pindah halaman + Tutup Dropdown + Bersihin Input
  const handleNavigation = (path) => {
    navigate(path);
    setShowDropdown(false);
    setSearchTerm("");
  };

  // Logika Pencarian dengan Debounce (500ms)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length > 1) {
        try {
          const res = await globalSearch(searchTerm);
          setResults(res.data.data);
          setShowDropdown(true);
        } catch (err) {
          console.log("Search Error:", err);
        }
      } else {
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: (data) => {
      dispatch(removeUser())
      navigate("/auth")
    }
  })

  const handleLogout = () => logoutMutation.mutate();

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-[#1a1a1a] relative z-[100]">
      {/* LOGO */}
      <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
        <img src={logo} className="h-8 w-8" alt="restro logo" />
        <h1 className="text-lg font-semibold text-[#f5f5f5]">AkuLapar</h1>
      </div>

      {/* SEARCH CONTAINER */}
      <div className="relative">
        <div className="flex items-center gap-4 bg-[#1f1f1f] rounded-[15px] px-5 py-2 w-[500px] border border-transparent focus-within:border-orange-500 transition-all">
          <FaSearch className="text-[#f5f5f5]" />
          <input
            type="text"
            placeholder="Cari menu, pelanggan, atau kategori..."
            className="bg-[#1f1f1f] outline-none text-[#f5f5f5] w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* DROPDOWN HASIL PENCARIAN */}
        {showDropdown && (
          <div className="absolute top-[55px] left-0 w-full bg-[#1f1f1f] rounded-[15px] p-4 shadow-2xl border border-[#333] max-h-[450px] overflow-y-auto z-50">

            {/* HASIL DISHES */}
            {results.dishes.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-[#ababab] text-[10px] font-bold mb-2 tracking-widest uppercase">
                  <FaUtensils /> Menu Makanan
                </div>
                {results.dishes.map(dish => (
                  <div
                    key={dish._id}
                    onClick={() => handleNavigation('/menu')}
                    className="p-2 hover:bg-[#2a2a2a] rounded-lg cursor-pointer flex justify-between items-center transition-colors group"
                  >
                    <span className="text-[#f5f5f5] group-hover:text-orange-400">{dish.title}</span>
                    <span className="text-xs text-[#ababab]">Rp {dish.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            {/* HASIL ORDERS */}
            {results.orders.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-[#ababab] text-[10px] font-bold mb-2 tracking-widest uppercase">
                  <FaUserAlt /> Transaksi Hari Ini
                </div>
                {results.orders.map(order => (
                  <div
                    key={order._id}
                    className="p-2 bg-[#2a2a2a]/40 rounded-lg flex justify-between items-center mb-1 border border-[#333]/30"
                  >
                    <span className="text-[#f5f5f5] text-sm font-medium">
                      {order.customerDetails.name}
                    </span>
                    <span className="text-sm text-green-400 font-bold bg-green-900/20 px-3 py-1 rounded-md">
                      Rp {order.bills.total.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* HASIL CATEGORIES */}
            {results.categories.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-[#ababab] text-[10px] font-bold mb-2 tracking-widest uppercase">
                  <FaLayerGroup /> Kategori
                </div>
                <div className="flex flex-wrap gap-2">
                  {results.categories.map(cat => (
                    <div
                      key={cat._id}
                      onClick={() => handleNavigation('/menu')}
                      className="px-3 py-1 bg-[#2a2a2a] text-[#f5f5f5] rounded-full text-xs hover:bg-orange-600 transition-all cursor-pointer"
                    >
                      {cat.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* JIKA KOSONG */}
            {results.dishes.length === 0 && results.orders.length === 0 && results.categories.length === 0 && (
              <div className="text-[#ababab] text-center text-sm py-4 italic">
                Wah, "{searchTerm}" gak ketemu...
              </div>
            )}
          </div>
        )}
      </div>

      {/* USER DETAILS */}
      <div className="flex items-center gap-4">
        {userData.role === "Admin" && (
          <div onClick={() => navigate("/dashboard")} className="bg-[#1f1f1f] rounded-[15px] p-3 cursor-pointer hover:bg-[#2a2a2a] transition-colors">
            <MdDashboard className="text-[#f5f5f5] text-2xl" />
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <FaUserCircle className="text-[#f5f5f5] text-4xl" />
            <div className="flex flex-col items-start">
              <h1 className="text-md text-[#f5f5f5] font-semibold uppercase">{userData.name || "USER"}</h1>
              <p className="text-xs text-[#ababab] font-medium">{userData.role || "Role"}</p>
            </div>
          </div>
          <IoLogOut onClick={handleLogout} className="text-[#f5f5f5] ml-2 hover:text-red-500 transition-colors cursor-pointer" size={30} />
        </div>
      </div>
    </header>
  );
};

export default Header;