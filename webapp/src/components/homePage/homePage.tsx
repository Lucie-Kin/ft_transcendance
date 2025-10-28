import "../../style/homePage/homepage.css"
import { jwtDecode } from "jwt-decode";
import useToken from "../../hooks/auth.tsx"

interface JwtPayload {
  login: string;
  email: string;
  exp: number;
  iat?: number;
} // il faut def le type du JWT, sinon TS ne le reconnait pas et ne sait pas que login existe


export default function homePage() {
    useToken();

  const token = localStorage.getItem('token');
  let user: JwtPayload | null = null; // pour utiliser user.login
  if (token) {
    try {
      user = jwtDecode<JwtPayload>(token);
    } catch(err) {
        console.error("Token invalide:", err);
        localStorage.removeItem('token');
        window.location.href = '/';
        return null;
    }
  }

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div>
        <h1>Accès refusé</h1>
        <p>Veuillez vous <a href="/">connecter</a>.</p>
      </div>
    );
  }
    return (
        <div> <h1>Transcendance Home Page</h1>
        <button onClick={logout}>Déconnexion</button>
          <div>Bienvenue, {user.login}</div> 
          </div>
    );
}
