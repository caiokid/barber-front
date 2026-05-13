import { AuthProvider } from "./Auth/AuthContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Marcar from "./pages/Marcar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { PrivateRoute } from "./Auth/PrivateRoute";
import Services from "./pages/Serviços";
import Employs from "./pages/Employs";
import { Bounce, ToastContainer } from "react-toastify";
import MarcadosPage from "./pages/Marcados";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";




function App() {
  

  return (
  <>

   <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={< Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastrar" element={<Signup />} />
        <Route path="/recuperar-senha" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />


        <Route
          path="/employs/barbers"
          element={
            <PrivateRoute>
            <Employs></Employs>
            </PrivateRoute>
          } />
        <Route
          path="/marcar/service/:funcId"
          element={
            <PrivateRoute>
            <Services></Services>
            </PrivateRoute>
          } />

          <Route
          path="/marcar/:services"
          element={
            <PrivateRoute>
            <Marcar></Marcar>
            </PrivateRoute>
          } />

          <Route
          path="/marcar/services/:mes"
          element={
            <PrivateRoute>
            <Marcar></Marcar>
            </PrivateRoute>
          } />
            <Route
          path="/marcado/confirmed"
          element={
            <PrivateRoute>
              <MarcadosPage>
                
              </MarcadosPage>
            </PrivateRoute>
          } />

          <Route
          path="/marcar/services/:mes"
          element={
            <PrivateRoute>
            <Marcar></Marcar>
            </PrivateRoute>
          } />
            <Route
          path="/marcado/confirmed"
          element={
            <PrivateRoute>
              <MarcadosPage>
                
              </MarcadosPage>
            </PrivateRoute>
          } />
       </Routes>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
        />

    </BrowserRouter>
  </AuthProvider>  
  </>
  )
}

export default App;
