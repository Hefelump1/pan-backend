import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Events } from "./pages/Events";
import { Committee } from "./pages/Committee";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/weekly" element={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><h1 className="text-4xl text-gray-900">Weekly Activities</h1></div>} />
          <Route path="/hall-hire" element={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><h1 className="text-4xl text-gray-900">Hall Hire</h1></div>} />
          <Route path="/committee" element={<Committee />} />
          <Route path="/groups" element={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><h1 className="text-4xl text-gray-900">Associated Groups</h1></div>} />
          <Route path="/constitution" element={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><h1 className="text-4xl text-gray-900">Constitution</h1></div>} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
