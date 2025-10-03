/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.tsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/09/08 16:28:16 by mobonill          #+#    #+#             */
/*   Updated: 2025/10/03 11:49:08 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './App.css'

import { Routes, Route } from 'react-router-dom';

import Home from './components/homePage/homePage'

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			{/* <Rout path="/home" element */}
			{/* <Route path="/home" element={Home}/> */}
		</Routes>
	)
}

export default App

