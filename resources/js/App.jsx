import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./Routes/routes";
import useUserStore from "./Store/useUserStore";
import { VerifyLogin } from "./Components/VerifyLogin/VerifyLogin";
import Profile from "./Pages/Profile/Profile";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import Admin from "./Pages/Admin/Admin";
import { OnlyAdmin } from "./Components/OnlyAdmin/OnlyAdmin";

function App() {

	const isAuth = useUserStore((state) => state.isAuth);
	const user = useUserStore((state) => state.user);

    return (
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
					<Route element={ <VerifyLogin isAuth={isAuth} /> }>
						<Route path="/profile" element={<Profile/>} />
					</Route>
					<Route element={ <OnlyAdmin user={user} />}>
						<Route path="/admin" element={<Admin/>} />
					</Route>
				</Routes>
          	<Footer/>
        </Router>
    );
  }
  
export default App;