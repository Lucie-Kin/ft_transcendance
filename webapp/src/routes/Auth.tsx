import { useEffect } from 'react';

export default function AuthCallback() {
  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get('token');
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      window.location.replace('/home');
    } else {
      window.location.replace('/');
    }
  }, []);

  return <div>Connexion…</div>;
}