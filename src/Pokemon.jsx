import React, { useState, useRef } from 'react';

function Pokemon() {
    const [pokemonData, setPokemonData] = useState(null); // State to store fetched data
    const [error, setError] = useState(null); // State to handle any errors
    const inputRef = useRef(null)


    async function searchPokemon() {
        const pokemonInput = document.getElementById("pokemonInput").value;
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemonInput.toLowerCase()}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Pokémon not found!');
            } 
            if( inputRef.current.value === ""){
                setError("Please enter a pokemon name");
                return
            }
            const data = await response.json();
            console.log(data)
            setPokemonData(data); 
            setError(null); 
        } catch (err) {
            setError(err.message);
            setPokemonData(null);
            inputRef.current.value = ``
        }
    }


   function enterCommand(e){
    if(e.key === "Enter"){
        searchPokemon()
    }
   }

    return (
        <>
            <div className="container">
                <h1>Welcome to our Pokémon website</h1>
                <h2>Here you can find details about any Pokémon</h2>
                <input onKeyDown={enterCommand} ref={inputRef} type="text" id="pokemonInput" placeholder="Search your Pokémon ex. pikachu" />
                <button onClick={searchPokemon}>Search</button>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                {pokemonData && (
                    <>
                        <p>Type: {pokemonData.types[0].type.name}</p>
                        <p>Power: {pokemonData.base_experience} 💪</p>
                        <p>Special Abilities:</p>
                        <ul>
                            {pokemonData.abilities.map((ability, index) => (
                                <li key={index}>{ability.ability.name}</li>
                            ))}
                        </ul>
                        <p>Special moves: {pokemonData.moves[0].move.name} and { pokemonData.moves[1] && pokemonData.moves[1].move.name}</p>
                        <img src={pokemonData.sprites.front_default} alt="" />
                    </>
                )}
            </div>
        </>
    );
}

export default Pokemon;
