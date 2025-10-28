/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.tsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/09/08 16:28:16 by mobonill          #+#    #+#             */
/*   Updated: 2025/10/28 15:36:15 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './App.css'

import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/loginPage/loginPage';
import Register from './components/loginPage/register';
import HomePage from './components/homePage/homePage';
import {jwtDecode} from "jwt-decode";


function App() {
  
  const token = localStorage.getItem('token');
  const isAuthenticated = token && !isTokenExpired(token);

  function isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
	return (
		<Routes>
			<Route path="/" element={<LoginPage />} />
        	<Route path="/register" element={<Register />} />
          <Route path="/home" element={isAuthenticated ? <HomePage />  : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	)
}

export default App

