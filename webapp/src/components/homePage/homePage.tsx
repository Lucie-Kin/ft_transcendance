import "../../style/home/homepage.css";
import Login from '../login/Login'
import { IoMailOutline } from "react-icons/io5";
import { IoLockClosedOutline } from "react-icons/io5";


export default function HomePage() {
  return (
    <div> <h1>Transcendance</h1>
    <div className="container">
      <div className="wrapper">
        <section className="login">
          <h2>Connexion</h2>
            <Login/> <br></br>
          <form>
            <div className="inputbox">
                <IoMailOutline size={20} />
              <input type="email" id="email" />
              <label htmlFor="email"> Email</label>
            </div>

            <div className="inputbox">
                <IoLockClosedOutline size={20} />
              <input type="password" id="password" />
              <label htmlFor="password"> Mot de passe</label>
            </div>

            <div className="inputbox">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember"> Se souvenir de moi</label>
              <br></br>
              <a href="">Mot de passe oublié ?</a>
            </div>

            <button type="submit">Connexion</button>

            <div className="register">
              <span>Pas de compte ?</span>
              <a href=""> S'inscrire</a>
            </div>
          </form>
        </section>
      </div>
    </div>
    </div>
  );
}
