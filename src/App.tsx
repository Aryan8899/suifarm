import { HashRouter as Router, Route, Routes } from "react-router-dom";
// App.tsx
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { Farm } from "./pages/Farm";
import { Pair } from "./pages/Pair";

const App = () => {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/farm" element={<Farm />} />
            <Route path="/pair" element={<Pair />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
