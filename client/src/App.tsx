import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Admin from './Admin/Admin';
import AdminRoute from './Admin/AdminMiddleware';
import './App.css';
import AuthTest from './Components/AuthTest/AuthTest';
import Footer from './Components/footer';
import Login from './Components/Login/Login';
import Register from './Components/Login/Register';
import Navbar from "./Components/Navbar";
import { AuthProvider } from './context/AuthContext';
import AuthRoute from './context/AuthMiddleware';
import About from './Pages/About';
import FunctionTest from './Pages/FunctionTest';
import Home from './Pages/Home';
import Legal from './Pages/Legal';
import Tour from './Pages/Tour';
import Profile from './Pages/UserProfile';

const App = () => {

  return (
    <AuthProvider>
      <Router>
          <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<AuthRoute><Profile /></AuthRoute>} />
              <Route path="/dashboard" element={<AdminRoute><Admin /></AdminRoute>} />
              <Route path="/about" element={<About />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/" element={<Home />} />
              <Route path="/tours" element={<Tour />} />
            </Routes>
          <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;