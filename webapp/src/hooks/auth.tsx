import { useEffect } from 'react';

export default function useToken() {
  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get('token'); // lit ?token= dans l'URL
    if (urlToken) {
      localStorage.setItem('token', urlToken);// sauv dans localStorage
      window.history.replaceState({}, '', window.location.pathname);// nettoie l'URL (enlève ?token=...)
    }
  }, []); // une seule fois au chargement
};