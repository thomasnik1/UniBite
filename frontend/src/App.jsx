import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Ads from './pages/Ads';
import Register from './pages/Register';
import CreateAd from './pages/CreateAd';
import MyAds from './pages/MyAds';
import EditAd from './pages/EditAd';
import Requests from './pages/Requests';
import Profile from './pages/Profile'; // Εισάγουμε τη νέα σελίδα Προφίλ
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute'; // Εισάγουμε το AdminRoute

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/ads/feed" element={<Ads />} />
            <Route path="/create" element={<Register />} />
            <Route path="/ads/create" element={<CreateAd />} />
            <Route path="/ads/my-ads" element={<MyAds />} />
            <Route path="/ads/edit/:id" element={<EditAd />} />
            <Route path="/requests/show" element={<Requests />} />
            <Route path="/profile" element={<Profile />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
            <Route path="*" element={<Navigate to="/ads/feed" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;