import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/Home/HomePage.jsx";
import AboutPage from "./pages/About/AboutPage.jsx";
import CarePostsPage from "./pages/CarePosts/CarePostsPage.jsx";
import PlantListingsPage from "./pages/PlantListings/PlantListingsPage.jsx";
import ListingDetailPage from "./pages/PlantListings/ListingDetailPage.jsx";
import CreateListingPage from "./pages/PlantListings/CreateListingPage.jsx";
import EditListingPage from "./pages/PlantListings/EditListingPage.jsx";
import RegisterPage from "./pages/Auth/RegisterPage.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";

export default function App() {
  return (
    <AuthProvider>
      <div className="app-wrapper">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/careposts" element={<CarePostsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/listings" element={<PlantListingsPage />} />
            <Route path="/listings/new" element={<CreateListingPage />} />
            <Route path="/listings/:id" element={<ListingDetailPage />} />
            <Route path="/listings/:id/edit" element={<EditListingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
