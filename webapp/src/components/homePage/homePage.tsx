import { useEffect, useState } from 'react';

type User = { id: number; login: string; email: string; image?: string } | null;

export default function HomePage() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('https://localhost:8443/auth/session', {
          credentials: 'include',
        });
        if (res.ok) {
          const { user } = await res.json();
          setUser(user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    await fetch('https://localhost:8443/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    window.location.href = '/';
  };

  if (loading) return <div>Chargement…</div>;
  if (!user) return <div>Accès refusé. <a href="/">Connecte-toi</a>.</div>;

  return (
    <div>
      <h1>Transcendance Home Page</h1>
      <button onClick={logout}>Déconnexion</button>
      <div>Bienvenue, {user.login}</div>
    </div>
  );
}
