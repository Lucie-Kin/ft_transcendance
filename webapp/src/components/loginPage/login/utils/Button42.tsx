/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Button42.tsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/09/08 16:28:09 by mobonill          #+#    #+#             */
/*   Updated: 2025/10/23 16:28:16 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import '../../../../style/login/button42.css'
import logo42 from '../../../../assets/logo42.jpg'

export default function Button42() {
	const handleClick = () => {
		console.log("Je suis le bouton de 42")
	}

	return (
		<button className="button42" onClick={handleClick}>
			<img src={logo42} alt="logo" className='logo42' />
			Continuez avec 42
		</button>
	)
}
