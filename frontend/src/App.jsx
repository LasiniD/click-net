import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';

import HomePage from './pages/HomePage';
import SignUpPage from './pages/auth/SignUpPage';
import LoginPage from './pages/auth/LoginPage';
import NotificationsPage from './pages/NotificationsPage';
import NetoworkPage from './pages/NetworkPage';
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from './lib/axios';

function App() {

  const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
        //console.log("Axios Base URL:", axiosInstance.defaults.baseURL);
        //console.log("Data being sent:", data);
				const res = await axiosInstance.get("/auth/me");
				return res.data;
			} catch (err) {
				if (err.response && err.response.status === 401) {
					return null;
				}
				toast.error(err.response.data.message || "Something went wrong");
			}
		},
	});

  console.log("authUser", authUser);

	if (isLoading) return null;

  return (
  <Layout>
    <Routes>
      <Route path='/' element={authUser ?<HomePage /> : <Navigate to={"/login"}/>} />
      <Route path='/signup' element={!authUser ?<SignUpPage /> : <Navigate to={"/"}/>} />
      <Route path='/login' element={!authUser ?<LoginPage /> : <Navigate to={"/"}/>} />
      <Route path='/notifications' element={authUser ?<NotificationsPage /> : <Navigate to={"/login"}/>} />
      <Route path='/network' element={authUser ?<NetoworkPage /> : <Navigate to={"/login"}/>} />
    </Routes>
    <Toaster />
  </Layout>
  );
}

export default App
