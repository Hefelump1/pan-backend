import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { ScrollToTop } from "./components/ScrollToTop";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Events } from "./pages/Events";
import { News } from "./pages/News";
import { WeeklyActivities } from "./pages/WeeklyActivities";
import { HallHire } from "./pages/HallHire";
import { Committee } from "./pages/Committee";
import { AssociatedGroups } from "./pages/AssociatedGroups";
import { Constitution } from "./pages/Constitution";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminBookings } from "./pages/AdminBookings";
import { AdminNews } from "./pages/AdminNews";
import { AdminEvents } from "./pages/AdminEvents";
import { AdminCommittee } from "./pages/AdminCommittee";
import { AdminGroups } from "./pages/AdminGroups";
import { AdminActivities } from "./pages/AdminActivities";
import { AdminHomePage } from "./pages/AdminHomePage";
import { AdminHallHire } from "./pages/AdminHallHire";
import { AdminDocuments } from "./pages/AdminDocuments";
import { AdminAGM } from "./pages/AdminAGM";
import { AdminUsefulLinks } from "./pages/AdminUsefulLinks";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App">
      <LanguageProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            } />
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route path="/events" element={<><Navbar /><Events /><Footer /></>} />
            <Route path="/news" element={<><Navbar /><News /><Footer /></>} />
            <Route path="/weekly" element={<><Navbar /><WeeklyActivities /><Footer /></>} />
            <Route path="/hall-hire" element={<><Navbar /><HallHire /><Footer /></>} />
            <Route path="/committee" element={<><Navbar /><Committee /><Footer /></>} />
            <Route path="/groups" element={<><Navbar /><AssociatedGroups /><Footer /></>} />
            <Route path="/constitution" element={<><Navbar /><Constitution /><Footer /></>} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/news" element={<AdminNews />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/committee" element={<AdminCommittee />} />
            <Route path="/admin/groups" element={<AdminGroups />} />
            <Route path="/admin/activities" element={<AdminActivities />} />
            <Route path="/admin/homepage" element={<AdminHomePage />} />
            <Route path="/admin/hallhire" element={<AdminHallHire />} />
            <Route path="/admin/documents" element={<AdminDocuments />} />
            <Route path="/admin/agm" element={<AdminAGM />} />
            <Route path="/admin/useful-links" element={<AdminUsefulLinks />} />
            
            {/* Catch-all redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </LanguageProvider>
    </div>
  );
}

export default App;
