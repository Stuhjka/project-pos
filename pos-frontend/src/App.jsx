import Header from "./components/shared/Header";
import { Home, Auth, Orders, Tables, Dashboard } from "./pages";
// 👇 Perbaikan 1: Tambah 'Navigate' di sini. Lu pake component <Navigate> di bawah tapi lupa import.
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom"; 
import Menu from "./pages/Menu";
import { useSelector } from "react-redux";
import useLoadData from "../hooks/useLoadData";
import FullScreenLoader from "./components/shared/FullscreenLoader";

function ProtectedRoutes({children}) {
  const {isAuth} = useSelector(state => state.user); 
  
  if(!isAuth){
    return <Navigate to="/auth" />
  }

  return children;
} 

function Layout() {
  const location = useLocation(); 
  const hideHeaderPaths = ["/auth"]; 
  const isLoading = useLoadData()
  // 👇 Perbaikan 3: Typo yang sama kayak di atas, ganti '=' jadi '=>'
  const { isAuth } = useSelector(state => state.user);

  if(isLoading) return <FullScreenLoader />

  return (
    <>
      {!hideHeaderPaths.includes(location.pathname) && <Header />}
        <Routes>
          <Route path="/" element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          } />
          
          {/* Logic ini udah bener: Kalau udah login (isAuth), lempar balik ke Home, jangan kasih akses ke Auth page lagi */}
          <Route path="/auth" element={isAuth ? <Navigate to="/" /> : <Auth />} />
          
          <Route path="/orders" element={
            <ProtectedRoutes>
              <Orders />
            </ProtectedRoutes>
          } />
          <Route path="/tables" element={
            <ProtectedRoutes>
              <Tables />
            </ProtectedRoutes>
          } />
          <Route
           path="/menu"
           element={<ProtectedRoutes>
              <Menu />
           </ProtectedRoutes>
          } 
          />
          <Route
           path="/dashboard"
           element={<ProtectedRoutes>
              <Dashboard />
           </ProtectedRoutes>
          } 
          />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  )
}

export default App;