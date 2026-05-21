import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { AllRoutes } from "./routers/AllRoutes";

function App() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: "90vh" }}>
        <AllRoutes />
      </div>
      <Footer />
    </>
  );
}

export default App;
