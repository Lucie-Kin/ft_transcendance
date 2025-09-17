/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Button42.tsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mobonill <mobonill@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/09/08 16:28:09 by mobonill          #+#    #+#             */
/*   Updated: 2025/09/17 14:47:17 by mobonill         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import '../../../style/login/button42.css'

export default function Button42() {
	const handleClick = () => {
		console.log("Je suis le bouton de 42")
	}

	return (
		<button className="button42" onClick={handleClick}>
			Login with 42!
		</button>
	)
}
