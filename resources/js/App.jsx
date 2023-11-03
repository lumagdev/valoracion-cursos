import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./Routes/routes";
import { AuthProvider } from "./Context";
import { VerifyLogin } from "./Components/VerifyLogin";
import Profile from "./Pages/Profile";

function App() {
    return (
      <AuthProvider>
        <Router>
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
        </Router>
      </AuthProvider>
    );
  }
  
  export default App;