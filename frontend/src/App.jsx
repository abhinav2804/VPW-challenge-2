import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AppShell from './components/layout/AppShell';
import { useAppStore } from './store/useAppStore';

// Lazy loading or direct imports for pages
import Home from './pages/Home';
import Eligibility from './pages/Eligibility';
import ResidenceMaps from './pages/ResidenceMaps';
import DocumentChecklist from './pages/DocumentChecklist';
import RegistrationWalkthrough from './pages/RegistrationWalkthrough';
import StatusNextSteps from './pages/StatusNextSteps';
import QuizBadges from './pages/QuizBadges';
import HelpSources from './pages/HelpSources';

// Route Sync Component to handle browser back button updating progress bar
const RouteSync = () => {
  const location = useLocation();
  const { setPhase, setProgress } = useAppStore();
  
  useEffect(() => {
    // Sync the global progress bar when user uses browser back/forward buttons
    const path = location.pathname;
    if (path === '/') { setPhase(0); setProgress(0); }
    else if (path === '/eligibility') { setPhase(1); setProgress(10); }
    else if (path === '/residence') { setPhase(2); setProgress(55); }
    else if (path === '/checklist') { setPhase(4); setProgress(70); }
    else if (path === '/walkthrough') { setPhase(5); setProgress(80); }
    else if (path === '/status') { setPhase(6); setProgress(90); }
    else if (path === '/quiz') { setPhase(7); setProgress(95); }
  }, [location.pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <RouteSync />
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/eligibility" element={<Eligibility />} />
          <Route path="/residence" element={<ResidenceMaps />} />
          <Route path="/checklist" element={<DocumentChecklist />} />
          <Route path="/walkthrough" element={<RegistrationWalkthrough />} />
          <Route path="/status" element={<StatusNextSteps />} />
          <Route path="/quiz" element={<QuizBadges />} />
          <Route path="/help" element={<HelpSources />} />
        </Routes>
      </AppShell>
    </Router>
  );
}

export default App;
