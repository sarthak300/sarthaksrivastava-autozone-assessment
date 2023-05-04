import React, { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [planets, setPlanets] = useState([]);
  const [people, setPeople] = useState();
  const [errMsg, setErrMsg] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  
  useEffect(() => {
    getStarWarData("https://swapi.dev/api/planets/");
  }, []);

  //fn to fetch all the planets
  const getStarWarData = async (url) => {
    setLoading(true);
    try {
      const data = await fetch(url);
      const response = await data.json();
      setPage(Number(url[url.length - 1]) || 1);
      setPlanets(response);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  //fn to fetch resident from the selected planets
  const getListOfPeopleFromPlanet = async (list, urls) => {
    setUserLoading(true);
    try {
      if (list.length > 0) {
        const texts = await Promise.all(
          urls.map(async (url) => {
            const resp = await fetch(url);
            const peopleRes = await resp.json();
            return peopleRes?.name;
          })
        );
        setPeople(texts);
        setErrMsg("");
      } else {
        setErrMsg("No Resident found from this planet!!");
        setPeople([]);
      }
      setUserLoading(false);
    } catch (err) {
      console.log(err);
      setUserLoading(false);
    }
  };
  //fn to call the next list of planets
  const handleNext = (next) => {
    setPeople([]);
    setErrMsg("")
    getStarWarData(next);
  };
  //fn to call the previous list of planets
  const handlePrev = (prev) => {
    setPeople([]);
    setErrMsg("")
    getStarWarData(prev);
  };
  //fn called on selecting the planet to get resident detail
  const handlePlanetClick = async (e) => {
    setPeople([]);
    setErrMsg("");
    const list = e.target.value;
    const urls = list.split(",");
    if (list !== "Select one") {
      getListOfPeopleFromPlanet(list, urls);
    }
  };

  return (
    <div className="main_page">
      <h1> Star War Universe</h1>
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <>
          <div className="planets_div">
            <label className="text planet_label" htmlFor="planets">
              Planets :
            </label>
            <select
              id="planets"
              className="text planets-dropdown"
              onChange={(e) => handlePlanetClick(e)}
            >
              <option>Select one</option>
              {planets?.results?.map((user) => (
                <option key={user.name} value={user?.residents}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="pagination-align">
            <button
              disabled={!planets?.previous?.length > 0}
              onClick={() => handlePrev(planets?.previous)}
            >
              ←
            </button>
            <span className="paginattion">
              List {page} of{" "}
              {Math.ceil(planets.count / planets?.results?.length)}
            </span>
            <button
              disabled={!planets?.next?.length > 0}
              onClick={() => handleNext(planets?.next)}
            >
              →
            </button>
          </div>
          <div className="people_list">
            {userLoading ? (
              <div className="loader">Loading...</div>
            ) : (
              <>
                {errMsg && <div className="text err-msg">{errMsg}</div>}
                {people?.length > 0 && (
                  <>
                    <h3>List of people from this planet</h3>
                    <ol className="text">
                      {people?.map((person) => (
                        <li key={person}>{person}</li>
                      ))}
                    </ol>
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
