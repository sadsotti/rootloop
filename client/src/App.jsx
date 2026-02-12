import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import News from './pages/News';
import Profile from './pages/Profile';
import Social from './pages/Social';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
    const { token } = useContext(AuthContext);
    return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-main text-textMain selection:bg-accent/30">
          
          <Navbar />

          <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/news" element={
                <ProtectedRoute><News /></ProtectedRoute>
              } />
              <Route path="/social" element={
                <ProtectedRoute><Social /></ProtectedRoute>
              } />
              <Route path="/user/:id" element={
                <ProtectedRoute><UserProfile /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;