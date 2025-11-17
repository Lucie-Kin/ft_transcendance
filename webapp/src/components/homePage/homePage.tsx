import { useEffect, useState } from 'react';
import "../../style/homePage/homepage.css"

type User = {
  id: number;
  login: string;
  email: string;
  image?: string
} | null;

export default function HomePage() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('https://localhost:8443/auth/session', {
          credentials: 'include',
        });
        const defaultAvatar = "../../../avatar.png";

        if (res.ok) {
          const { user } = await res.json();
          if (!user.image)
            user.image = defaultAvatar;
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
      <div className="gameBox">
      </div> 
      <div><h1>Transcendance Home Page</h1>
        <h2> Bienvenue, {user.login}</h2>
      </div>

     

      
      <div className='settingsBox'>
        <div className="avatarHomePage">
          <img src={user.image} ></img>
        </div>
        <div className='loginHomePage'>{user.login}</div>
        <div><button className="logoutHome" type="button" onClick={logout}>Déconnexion</button>
      </div>
      </div>


    </div>
  );
}
