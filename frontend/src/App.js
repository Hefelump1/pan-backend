import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Events } from "./pages/Events";
import { HallHire } from "./pages/HallHire";
import { Committee } from "./pages/Committee";
import { AssociatedGroups } from "./pages/AssociatedGroups";
import { Constitution } from "./pages/Constitution";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/weekly" element={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><h1 className="text-4xl">Weekly Activities - Coming Soon</h1></div>} />
          <Route path="/hall-hire" element={<HallHire />} />
          <Route path="/committee" element={<Committee />} />
          <Route path="/groups" element={<AssociatedGroups />} />
          <Route path="/constitution" element={<Constitution />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
