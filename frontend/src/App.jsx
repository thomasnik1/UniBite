import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Ads from './pages/Ads';
import Register from './pages/Register';
import CreateAd from './pages/CreateAd';
import MyAds from './pages/MyAds';

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

            <Route path="*" element={<Navigate to="/ads/feed" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;