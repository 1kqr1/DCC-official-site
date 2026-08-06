import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RevealManager from './components/RevealManager';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Business from './pages/Business';
import Members from './pages/Members';
import MemberProfile from './pages/MemberProfile';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <RevealManager />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/business" element={<Business />} />
            <Route path="/members" element={<Members />} />
            <Route path="/members/:slug" element={<MemberProfile />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
