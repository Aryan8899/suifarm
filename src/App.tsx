import Sidebar from "./components/Sidebar";
import Header from "./components/Dasboard";

const App = () => {
  return (
    <div className="flex h-screen overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-y-auto">
      <Header />
    </main>
  </div>
  );
};

export default App;
