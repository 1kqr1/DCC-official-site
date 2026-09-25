import { ViewTransition } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RevealManager from './components/RevealManager';
import Opening from './components/Opening';
import DCCAIWidget from './components/DCCAIWidget';
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
        <RevealManager />
        <Header />
        <main id="main-content">
          <ViewTransition key={location.pathname} enter="dcc-file-enter" exit="dcc-file-exit">
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/business" element={<Business />} />
              <Route path="/members" element={<Members />} />
              <Route path="/members/:slug" element={<MemberProfile />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ViewTransition>
        </main>
        <Footer />
        <DCCAIWidget />
      </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
