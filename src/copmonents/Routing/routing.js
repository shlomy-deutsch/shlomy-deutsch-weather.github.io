import { Redirect, Route, Switch } from "react-router-dom";
import Favorites from "../Favorites/favorites";
import Home from "../home/home";


export default function Routing() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/favorites" component={Favorites} />
      <Redirect from="/" to="/home" exact />
      {/* <Route path="*" component={Page404} /> */}
    </Switch>
  );
}