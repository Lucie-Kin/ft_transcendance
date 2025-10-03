/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.tsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/09/08 16:28:16 by mobonill          #+#    #+#             */
/*   Updated: 2025/10/03 18:41:33 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './App.css'

import { Routes, Route } from 'react-router-dom';

import Home from './components/homePage/homePage'
import Register from './components/homePage/register'
 

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
        	<Route path="/register" element={<Register />} />
		</Routes>
	)
}

export default App

