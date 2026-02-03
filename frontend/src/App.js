import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Events } from "./pages/Events";
import { WeeklyActivities } from "./pages/WeeklyActivities";
import { HallHire } from "./pages/HallHire";
import { Committee } from "./pages/Committee";
import { AssociatedGroups } from "./pages/AssociatedGroups";
import { Constitution } from "./pages/Constitution";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminBookings } from "./pages/AdminBookings";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          } />
          <Route path="/events" element={<><Navbar /><Events /><Footer /></>} />
          <Route path="/weekly" element={<><Navbar /><WeeklyActivities /><Footer /></>} />
          <Route path="/hall-hire" element={<><Navbar /><HallHire /><Footer /></>} />
          <Route path="/committee" element={<><Navbar /><Committee /><Footer /></>} />
          <Route path="/groups" element={<><Navbar /><AssociatedGroups /><Footer /></>} />
          <Route path="/constitution" element={<><Navbar /><Constitution /><Footer /></>} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
