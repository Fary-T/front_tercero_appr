import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { UserProvider } from "./context/UserContext";
import { Doshboard } from "./pages/Doshboard/Doshboard";
import { DoshboardAgentes } from "./pages/DoshboardAgentes";
import { DoshboardClientes } from "./pages/DoshboardClientes/DoshboardClientes";
import { Planes } from "./pages/Planes/Planes";
import CotizarS from "./pages/CotizarS/CotizarS";
import CotizarV from "./pages/CotizarV/CotizarV";
import AuthGuard from "./guard/auth.guard";

function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<>NOT FOUND</>} />
            <Route path="/login" element={<Login />} />
            <Route path="/Planes" element={<Planes />} />
            <Route path="/CotizarS" element={<CotizarS />} />
            <Route path="/CotizarV" element={<CotizarV />} />
            <Route path="/home" element={<Home />} />

            <Route element={<AuthGuard />}>
              <Route path="/doshboard" element={<Doshboard />} />
              <Route path="/doshboardAgentes" element={<DoshboardAgentes />} />
              <Route path="/" element={<>Ruta base</>} />
              <Route
                path="/doshboardClientes"
                element={<DoshboardClientes />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
