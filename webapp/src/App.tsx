/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.tsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mobonill <mobonill@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/09/08 16:28:16 by mobonill          #+#    #+#             */
/*   Updated: 2025/09/24 18:28:05 by mobonill         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './App.css'

import { Routes, Route } from 'react-router-dom';

import Login from './components/login/Login'
// import Home from './qkwdjqkwdkqwjd' #TODO

function App() {
	return (
		<Routes>
			<Route path="/" element={<Login />} />
			{/* <Rout path="/home" element */}
			{/* <Route path="/home" element={Home}/> */}
		</Routes>
	)
}

export default App

