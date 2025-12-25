import Header from "./components/shared/Header";
import { Home, Auth, Orders, Tables, Dashboard } from "./pages";
// 👇 Perbaikan 1: Tambah 'Navigate' di sini. Lu pake component <Navigate> di bawah tapi lupa import.
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom"; 
import Menu from "./pages/Menu";
import { useSelector } from "react-redux";
import useLoadData from "../hooks/useLoadData";
import FullScreenLoader from "./components/shared/FullScreenLoader";
import BottomNav from "./components/shared/BottomNav";

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
  const isLoading = useLoadData();
  const { isAuth } = useSelector((state) => state.user);

  if (isLoading) return <FullScreenLoader />;

  const hideChrome = hideHeaderPaths.includes(location.pathname);

  return (
    <div className="flex flex-col h-dvh min-h-0">
      {!hideChrome && <Header />}

      <div className="flex-1 min-h-0">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <Home />
              </ProtectedRoutes>
            }
          />

          <Route path="/auth" element={isAuth ? <Navigate to="/" replace /> : <Auth />} />

          <Route
            path="/orders"
            element={
              <ProtectedRoutes>
                <Orders />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/tables"
            element={
              <ProtectedRoutes>
                <Tables />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/menu"
            element={
              <ProtectedRoutes>
                <Menu />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            }
          />

          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </div>

      {!hideChrome && <BottomNav />}
    </div>
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