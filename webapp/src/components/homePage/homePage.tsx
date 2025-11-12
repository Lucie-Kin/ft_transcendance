import "../../style/homePage/homepage.css"
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  login: string;
  email: string;
  exp: number;
  iat?: number;
} // il faut def le type du JWT, sinon TS ne le reconnait pas et ne sait pas que login existe


function isExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    if (!exp)
      return false;
    return exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export default function homePage() {

  const token = localStorage.getItem("token");
  let user: JwtPayload | null = null;

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        throw new Error("expired");
      }
      user = decoded;
    } catch (err) {
      console.error("Token invalide/expiré:", err);
      localStorage.removeItem("token");
      window.location.href = "/";
      return null;
    }
  }

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
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
