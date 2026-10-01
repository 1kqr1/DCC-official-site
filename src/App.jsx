import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RevealManager from './components/RevealManager';
import Opening from './components/Opening';
import DCCAIWidget from './components/DCCAIWidget';
import RouteScrollManager from './components/RouteScrollManager';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Business from './pages/Business';
import Members from './pages/Members';
import MemberProfile from './pages/MemberProfile';
import NotFound from './pages/NotFound';
import './index.css';

function AppLayout() {
  const location = useLocation();

  return (
    <div className="app-container">
        <Opening />
        <Header />
        <RouteScrollManager />
        <RevealManager />
        <main id="main-content">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/business" element={<Business />} />
            <Route path="/members" element={<Members />} />
            <Route path="/members/:slug" element={<MemberProfile />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <DCCAIWidget />
    </div>
  );
}

function App() {
  return (
    <Router useTransitions={false}>
      <AppLayout />
    </Router>
  );
}

export default App;
