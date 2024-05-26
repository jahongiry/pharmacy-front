import { AuthBindings, Authenticated, Refine } from '@refinedev/core';
import { RefineKbarProvider } from '@refinedev/kbar';

import { useNotificationProvider } from '@refinedev/antd';
import '@refinedev/antd/dist/reset.css';

import routerBindings, { CatchAllNavigate } from '@refinedev/react-router-v6';
import dataProvider, { axiosInstance } from '@refinedev/simple-rest';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import React from 'react';
import { Login } from './pages/Login/Login';
import { Header } from './components';
import { Users } from './pages/Users/Users';
import { CreateUser } from './pages/CreateUser/CreateUser';
import { Projects } from './pages/Projects/Projects';
import { ProjectDetail } from './pages/ProjectDetail/ProjectDetail';
import { StageDetail } from './pages/StageDetail/StageDetail';
import { AuthProvider } from './context/AuthProvider';
import { ResetPassword } from './pages/ResetPassword/ResetPassword';
import { CreateNewPassword } from './pages/CreateNewPassword/CreateNewPassword';
import { StagesDir } from './pages/Directories/pages/StagesDir/StagesDir';
import { StatusDir } from './pages/Directories/pages/StatusDir/StatusDir';
import { TaskDetailPage } from './pages/TaskDetailPage/TaskDetailPage';
import { ChainDetailPage } from './pages/Directories/pages/ChainDetai/ChainDetailPage';
import { ChainsDir } from './pages/Directories/pages/ChainsDir/ChainsDir';
import { UserDetails } from './pages/UserDetails/UserDetails';
import './index.css';
import { MyTasks } from './pages/MyTasks/MyTasks';

axiosInstance.interceptors.response.use(
  function (response: any) {
    return response;
  },
  function (error: any) {
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

function App() {
  const authProvider: AuthBindings = {
    login: async ({ token }) => {
      if (token && token !== 'undefined') {
        axiosInstance.defaults.headers.common = {
          Authorization: `Bearer ${token}`,
        };
        return {
          success: true,
          redirectTo: '/projects',
        };
      }

      return {
        success: false,
        error: {
          message: 'Login failed',
          name: 'Invalid email or password',
        },
      };
    },
    logout: async () => {
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      return {
        success: true,
        redirectTo: '/login',
      };
    },
    onError: async (error: Error) => {
      console.error(error);
      return { error };
    },
    check: async () => {
      if (localStorage.getItem('token')) {
        const token = localStorage.getItem('token');
        axiosInstance.defaults.headers.common = {
          Authorization: `Bearer ${token}`,
        };
        return {
          authenticated: true,
        };
      } else {
        return {
          authenticated: false,
          error: {
            message: 'Check failed',
            name: 'Not authenticated',
          },
          logout: true,
          redirectTo: '/login',
        };
      }
    },
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <RefineKbarProvider>
          <Refine
            dataProvider={dataProvider('https://api.fake-rest.refine.dev')}
            notificationProvider={useNotificationProvider}
            routerProvider={routerBindings}
            authProvider={authProvider}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    loading={<div>loading...</div>}
                    fallback={<CatchAllNavigate to='/login' />}
                    v3LegacyAuthProviderCompatible={true}
                    key={''}
                  >
                    <Header />
                    <Outlet />
                  </Authenticated>
                }
              >
                <Route
                  index
                  path={'/'}
                  element={<Navigate to={'projects'} />}
                />
                <Route path={'/users'} element={<Users />} />
                <Route path={'/user'} element={<UserDetails />} />
                <Route path={'/projects'} element={<Projects />} />
                <Route path={'/myTasks'} element={<MyTasks />} />
                <Route
                  path={'/projects/:projectId'}
                  element={<ProjectDetail />}
                />
                <Route
                  path={'/projects/:projectId/stage/:stageId'}
                  element={<StageDetail />}
                />
                <Route path={'/stages'} element={<StagesDir />} />
                <Route path={'/statuses'} element={<StatusDir />} />
                <Route path={'/chains'} element={<ChainsDir />} />
                <Route
                  path={'/task/:taskId/:projectId/:stageId'}
                  element={<TaskDetailPage />}
                />
                <Route path={'/chain/:chainId'} element={<ChainDetailPage />} />
              </Route>

              <Route
                element={
                  <Authenticated fallback={<Outlet />} key={'projects'}>
                    <Navigate to={'projects'} />
                  </Authenticated>
                }
              >
                <Route path={'login'} element={<Login />} />
                <Route path={'/create/:code'} element={<CreateUser />} />
                <Route path={'/reset'} element={<ResetPassword />} />
                <Route path={'/newPassword'} element={<CreateNewPassword />} />
              </Route>
            </Routes>
          </Refine>
        </RefineKbarProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
