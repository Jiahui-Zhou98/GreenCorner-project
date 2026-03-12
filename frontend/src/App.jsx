import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/Home/HomePage.jsx";
import AboutPage from "./pages/About/AboutPage.jsx";
import CarePostsPage from "./pages/CarePosts/CarePostsPage.jsx";
import PlantListingsPage from "./pages/PlantListings/PlantListingsPage.jsx";
import ListingDetailPage from "./pages/PlantListings/ListingDetailPage.jsx";
import CreateListingPage from "./pages/PlantListings/CreateListingPage.jsx";
import EditListingPage from "./pages/PlantListings/EditListingPage.jsx";

export default function App() {
  return (
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
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
