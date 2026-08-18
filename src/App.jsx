import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import ShareViewer from './pages/ShareViewer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/share/:id" element={<ShareViewer />} />
      </Routes>
    </Router>
  );
}

export default App;
