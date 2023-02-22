import { useEffect, useState } from "react";
import "./home.css";
import React from "react";
import axios from "axios";
import {
  DeleteProduct,
  SetoneProduct,
  SetProducts,
} from "../Redux/GlobalState";
import store from "../Redux/Store";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import {
  TextField,
  Checkbox,
  Typography,
  CardContent,
  Card,
} from "@material-ui/core";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";

function Home() {
  const history = useHistory();

  const handleClick = () => {
    history.push("/favorites");
  };
  const [tlv, setTlv] = useState([]);
  const [texttosearch, setTexttosearch] = useState("");
  const [result, setResult] = useState([]);
  const [dayOfWeek, setDayofweek] = useState([]);
  const [makeitchecked, setMakeitchecked] = useState();
  const [displayLocation, setdisplayLocation] = useState("");
  const [fahrenheit, setFahrenheit] = useState([]);
  const [celsius, setCelsius] = useState(false);
  const [nameofChosencity, setNameofChosencity] = useState({
    key1: 0,
    key2: "",
  });

  function search() {
    axios
      .get(
        `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=kdT1jLYQVACj5C7I9AOFINBIjfxudA0u&q=${texttosearch}`
      )
      .then((res) => {
        if (res.data === null || res.data.length === 0) {
          setdisplayLocation(
            "Sorry, no results for what you asked for, please try something else"
          );
          setResult([])
          return;
        }
        setResult(res.data);
        setdisplayLocation("")
      })
      .catch((err) => {
        console.log(err);
        setdisplayLocation(
          "Sorry, there is an error in the conection, please try later."
        );
        setTlv([]);
        setNameofChosencity({});
      });
  }
  const handleChange = (event) => {
    setTexttosearch(event.target.value);
  };
  async function sendCity(num, name) {
    const isProductAvailable = store
      .getState()
      .products.some((i) => i.key2 === name);
    setMakeitchecked(isProductAvailable);
    setTlv([]);
    setdisplayLocation("The wether in " + name);
    await axios
      .get(
        `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${num}?apikey=ROI8vARRlRQahUNF3w6YeFoMbc40l97I`
      )
      .then((res) => {
        setTlv(res.data.DailyForecasts);
        const dailyForecasts = res.data.DailyForecasts;
        const fahrenheitArray = dailyForecasts.map((forecast) => {
          const temperature = forecast.Temperature;
          return {
            key1: temperature.Minimum.Value,
            key2: temperature.Maximum.Value,
          };
        });
        setFahrenheit(fahrenheitArray);
      })
      .catch((err) => {
        console.log(err);
      });
    setNameofChosencity({
      key1: num,
      key2: name,
    });
  }
  function save() {
    if (makeitchecked === false) {
      setMakeitchecked(true);
      store.dispatch(SetProducts(nameofChosencity));
    } else {
      setMakeitchecked(false);
      store.dispatch(DeleteProduct(nameofChosencity));
    }
  }

  useEffect(() => {
    const savedCity = store.getState().oneProduct;
    console.log(savedCity);
    if (Object.keys(savedCity).length !== 0 && savedCity.name !== undefined) {
      setdisplayLocation("The wether in " + savedCity.name);
      setMakeitchecked(true);
      setNameofChosencity({
        key1: savedCity.num,
        key2: savedCity.name,
      });
      axios
        .get(
          `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${savedCity.num}?apikey=ROI8vARRlRQahUNF3w6YeFoMbc40l97I`
        )
        .then((res) => {
          setTlv(res.data.DailyForecasts);
          store.dispatch(SetoneProduct({}));
          const dailyForecasts = res.data.DailyForecasts;
          const daysOfWeek = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          const dayOfWeekArray = dailyForecasts.map((forecast) => {
            const date = new Date(forecast.Date);
            const dayOfWeek1 = daysOfWeek[date.getDay()];
            return dayOfWeek1;
          });
          setDayofweek(dayOfWeekArray);
          const fahrenheitArray = dailyForecasts.map((forecast) => {
            const temperature = forecast.Temperature;
            return {
              key1: temperature.Minimum.Value,
              key2: temperature.Maximum.Value,
            };
          });
          setFahrenheit(fahrenheitArray);
          return;
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    } else {
      axios
        .get(
          "https://dataservice.accuweather.com/forecasts/v1/daily/5day/215854?apikey=ROI8vARRlRQahUNF3w6YeFoMbc40l97I"
        )
        .then((res) => {
          setTlv(res.data.DailyForecasts);
          const dailyForecasts = res.data.DailyForecasts;
          const daysOfWeek = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          const dayOfWeekArray = dailyForecasts.map((forecast) => {
            const date = new Date(forecast.Date);
            const dayOfWeek1 = daysOfWeek[date.getDay()];
            return dayOfWeek1;
          });
          setDayofweek(dayOfWeekArray);
          setdisplayLocation("The wether in Tel - Aviv");
          setNameofChosencity({
            key1: "215854",
            key2: "Tel - Aviv",
          });
          const fahrenheitArray = dailyForecasts.map((forecast) => {
            const temperature = forecast.Temperature;
            return {
              key1: temperature.Minimum.Value,
              key2: temperature.Maximum.Value,
            };
          });
          setFahrenheit(fahrenheitArray);
          setMakeitchecked(false);
        })
        .catch((err) => {
          setdisplayLocation(
            "Sorry, something went wrong and we are unable to provide the requested service."
          );
        });
    }
  }, []);
  return (
    <>
      <div className="warp">
        <div>
          <TextField
            id="filled-basic"
            label="Search City"
            variant="filled"
            onChange={handleChange}
          />
          <Button
            onClick={search}
            variant="contained"
            color="primary"
            id="searchBtn"
          >
            search
          </Button>
        </div>
        <Button
          onClick={handleClick}
          variant="contained"
          color="secondary"
          id="faveroutsBtn"
        >
          Go to favoriets
        </Button>
      </div>
      <br></br>
      {result.map((i, index) => {
        const key = i.Key || index;
        return (
          <Button
            id="resultBtn"
            variant="contained"
            color="primary"
            key={key}
            onClick={(e) => {
              sendCity(i.Key, i.AdministrativeArea.LocalizedName);
            }}
          >
            {i.AdministrativeArea.LocalizedName}
          </Button>
        );
      })}
      <h4>{displayLocation}</h4>{" "}
      <Button
                  id="DisplayCelsius"
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    celsius ? setCelsius(false) : setCelsius(true)
                  }
                >
                  {celsius ? `Display Fahrenheit` : `Display Celsius`}
                </Button>
                <br></br><br></br>
      <div className="cards">
      
        {tlv.map((i, index) => {
          const key = i.Day ? i.Day : index;
          return (
            <Card id="card" sx={{ minWidth: 275 }} key={key}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {dayOfWeek[index]}
                </Typography>
                <Typography variant="body2">{i.Day.IconPhrase} </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {!celsius
                    ? `${fahrenheit[index].key1}°F - ${fahrenheit[index].key2}°F`
                    : `${(
                        ((fahrenheit[index].key1 - 32) * 5) /
                        9
                      ).toFixed()}°C - ${(
                        ((fahrenheit[index].key2 - 32) * 5) /
                        9
                      ).toFixed()}°C`}
                </Typography>
            
              </CardContent>
            </Card>
          );
        })}
      </div>
      <br></br>
      {tlv.length !== 0 ? (
        <label>
          <Checkbox
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            checked={makeitchecked}
            onChange={save}
          />{" "}
          Save
        </label>
      ) : null}
    </>
  );
}

export default Home;
