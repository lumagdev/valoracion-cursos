import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./Routes/routes";
import { AuthProvider } from "./Context";
import { VerifyLogin } from "./Utils/VerifyLogin";
import Profile from "./Pages/Profile/Profile";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";

function App() {
    return (
      <AuthProvider>
        <Router>
          <Header/>
            <Routes>
              {
                routes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                ))
              }
              <Route
                path="/profile"
                element={
                  <VerifyLogin redirectTo={'/login'}>
                    <Profile/>
                  </VerifyLogin>
                }
              />
            </Routes>
          <Footer/>
        </Router>
      </AuthProvider>
    );
  }
  
  export default App;