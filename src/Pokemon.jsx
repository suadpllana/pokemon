import React, { useState, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { LuSwords } from "react-icons/lu";
import { FaShieldAlt } from "react-icons/fa";
import { IoShield } from "react-icons/io5";
import { GiSwordsEmblem } from "react-icons/gi";
import { FaBoltLightning } from "react-icons/fa6";
import { GiStrongMan } from "react-icons/gi";
import { MdBloodtype } from "react-icons/md";

function Pokemon() {
  const [pokemonData, setPokemonData] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/");
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [pokemonName, setPokemonName] = useState("")
  const [search, setSearch] = useState(false);
  const [searchedPokemon, setSearchedPokemon] = useState([]);

  useEffect(() => {
    async function getPokemonData() {
      setLoading(true);
      const response = await fetch(url);
      const data = await response.json();
      setNextUrl(data.next);
      setPrevUrl(data.previous);
      getPokemon(data.results);

      setLoading(false);
    }
    getPokemonData();
  }, [url]);

  async function getPokemon(data) {
    const pokemonArray = await Promise.all(
      data.map(async (item) => {
        const result = await fetch(item.url);
        return await result.json();
      })
    );
    setPokemonData(pokemonArray);
    setFilteredPokemon([pokemonArray[0]]);
  }

  function getPokemonById(id) {
    {!search ? setFilteredPokemon(pokemonData.filter((pokemon) => pokemon.id === id)) : 
      setFilteredPokemon(searchedPokemon.filter((pokemon) => pokemon.id === id))
     }
    
  }

  async function searchPokemon(){
    if(pokemonName
      === "") return;
    try{
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const data = await response.json();
      console.log(data);
      setSearch(true)
      setSearchedPokemon([data]);
      setFilteredPokemon([data]);
    }
    catch(err){ 
      alert("Pokemon not found");
    }
  
  }
  function handleChange(value){
    if(value === ""){
      setSearch(false);
      setFilteredPokemon([pokemonData[0]]);
      return;
    }
    setPokemonName(value);

  }
  function searchByEnter(e){
    if(e.key === "Enter"){
      searchPokemon();
    }
  }

  return (
    <div className="container">
   
      {!loading ? (
        <>
    
          <div className="pokemon-display">
          <input placeholder="Search a pokemon e.g Pikachu" onKeyDown={(e) => searchByEnter(e)}  onChange={(e) => handleChange(e.target.value)}  type="text" name="" id="" />
          <button className="search-pokemon" onClick={searchPokemon}>Search</button>
            {!search ? pokemonData?.map((pokemon) => (
              <div
                key={pokemon.id}
                onClick={() => getPokemonById(pokemon.id)}
                className="pokemon"
              >
                <p>{pokemon.id}</p>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                <p>{pokemon.name}</p>
              </div>
            )) : 
            searchedPokemon.map((pokemon) => (
              <div
                key={pokemon.id}
                onClick={() => getPokemonById(pokemon.id)}
                className="pokemon"
              >
                <p>{pokemon.id}</p>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                <p>{pokemon.name}</p>
              </div>
            ))}

            {!search && (
              <>
                 <button
              className="prev"
              onClick={() =>{
                setUrl(prevUrl);
                setSearch(false);
              } }
              disabled={!prevUrl}
            >
              Prev
            </button>
            <button
              className="next"
              onClick={() =>{
                setUrl(nextUrl);
                setSearch(false);
              } }
              disabled={!nextUrl}
            >
              Next
            </button>
              </>
         
            )}
           
          </div>
          <div className="filtered-pokemon-container">
            {filteredPokemon.map((pokemon) => (
              <div key={pokemon.id} className="filtered-pokemon">
                <h2>{pokemon.name}</h2>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                <div className="button-ability">
                  {pokemon.abilities.map((ability) => (
                    <button key={ability.ability.name}>
                      {ability.ability.name}
                    </button>
                  ))}
                </div>
                {pokemon.stats.map((stat, index) => {
                 const statColor =
                 stat.stat.name === "hp"
                   ? "#78C850" 
                   : stat.stat.name === "attack"
                   ? "#F08030" 
                   : stat.stat.name === "defense"
                   ? "#F85888" 
                   : stat.stat.name === "speed"
                   ? "#F8D030" 
                   : stat.stat.name === "special-attack"
                   ? "#6890F0" 
                   : stat.stat.name === "special-defense"
                   ? "#FF5959" 
                   : "#A8A878"; 
               
                  return (
                    <p key={index}>
                      {index === 0 && <CiHeart />}
                      {index === 1 && <LuSwords />}
                      {index === 2 && <FaShieldAlt />}
                      {index === 3 && <GiSwordsEmblem />}
                      {index === 4 && <IoShield />}
                      {index === 5 && <FaBoltLightning />}
                      {stat.stat.name}: {stat.base_stat}
                      <div
                        style={{
                          width: "auto",
                          height: "10px",
                          background: "#ddd",
                          position: "relative",
                          marginLeft: "30px",
                        }}
                      >
                        <div
                          style={{
                            width: `${stat.base_stat}%`,
                            height: "100%",
                            background: statColor,
                            transition: "width 0.3s ease",
                          }}
                        ></div>
                      </div>
                    </p>
                  );
                })}

                <p>
                  <GiStrongMan /> Power: {pokemon.base_experience}
                </p>
                <p>
                  <MdBloodtype /> Types:{" "}
                  {pokemon.types.map((t) => t.type.name).join(", ")}
                </p>
                <p>Moves:</p>
                <ul>
                  {pokemon.moves.slice(0, 10).map((move) => (
                    <p key={move.move.name}>{move.move.name}</p>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default Pokemon;
