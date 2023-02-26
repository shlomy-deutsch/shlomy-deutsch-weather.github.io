import { SetoneProduct } from "../Redux/GlobalState";
import store from "../Redux/Store";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Favorites() {
  const [allfavorites, setAllfavorites] = useState([]);
  const [HeadLine, setHeadLine] = useState('')
  const prevProductsRef = useRef([]);

  function SavetoRedux(name, num) {
    store.dispatch(SetoneProduct({ name, num }));
  }
  useEffect(() => {
    const currentProducts = store.getState().products;
    if(currentProducts.length===0){setHeadLine('There is no favorites here'); return}
    if (prevProductsRef.current !== currentProducts) {
      prevProductsRef.current = currentProducts;
      const promises = currentProducts.map((i) => {
        return axios
          .get(
            `https://dataservice.accuweather.com/currentconditions/v1/${i.key1}?apikey=ROI8vARRlRQahUNF3w6YeFoMbc40l97I`
          )
          .then((res) => {
            return {
              num: i.key1,
              name: i.key2,
              WeatherText: res.data[0].WeatherText,
            };
          })
          .catch((err) => {
            console.log(err);
          });
      });
      Promise.all(promises).then((favorites) => {
        setAllfavorites(favorites);
        setHeadLine('This is your favorites')
      });
    }
  }, []);

  return (
    <div>
      <h1>{HeadLine}</h1>
      <Link to={"/"}>  <button>Go Back</button> </Link>

      {allfavorites.map((favorite) => (
        <div key={favorite.name}>
          <Link to={"/"}>
            <button onClick={() => SavetoRedux(favorite.name, favorite.num)}>
              <span>{favorite.name}</span>
              <p>{favorite.WeatherText}</p>
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Favorites;
