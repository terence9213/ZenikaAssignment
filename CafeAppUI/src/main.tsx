import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import './index.css'

import HomePage from './pages/HomePage.tsx'
import CafesPage from './pages/CafesPage.tsx'
import EmployeesPage from './pages/EmployeesPage.tsx'


const router = createBrowserRouter(
  [
    {path: '/', element: <HomePage/>, errorElement: <div>404 not found</div>},
    {path: '/CafesPage', element: <CafesPage/>},
    {path: '/EmployeesPage', element: <EmployeesPage/>},
    {path: '/EmployeesPage/:cafeId', element: <EmployeesPage/>}

  ]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)