import "./App.css";
import { useState, useEffect } from "react";
import Typewriter from "typewriter-effect";
import {
  pokemon,
  pokemonData,
  pokemonType,
  pokemonFire,
  pokemonWater,
  pokemonGrass,
  pokemonGround,
  pokemonPsychic,
  pokemonGhost,
  pokemonDragon,
  pokemonNormal,
  pokemonElectric,
  pokemonPoison,
  pokemonFighting,
} from "./pokemonGame.js";

let displayFireType = false;
let displayGrassType = false;
let displayWaterType = false;
let displayFightingType = false;
let displayGhostType = false;
let displayDragonType = false;
let displayNormalType = false;
let displayPsychicType = false;
let displayPoisonType = false;
let displayElectricType = false;
let displayGroundType = false;

function App() {
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState([]);
  const [opponentPokemon, setOpponentPokemon] = useState([]);
  const [selectedPokeNum, setSelectedPokeNum] = useState([]);
  const [display, setDisplay] = useState("");
  const [displayType, setDisplayType] = useState("");
  const [textDisplay, setTextDisplay] = useState(null);
  const [moveFirst, setMoveFirst] = useState("");
  const [moveEffectiveFirst, setMoveEffectiveFirst] = useState("");
  const [moveMissFirst, setMoveMissFirst] = useState("");
  const [moveSecond, setMoveSecond] = useState("");
  const [moveEffectiveSecond, setMoveEffectiveSecond] = useState("");
  const [moveMissSecond, setMoveMissSecond] = useState("");
  const [pokeDeath, setPokeDeath] = useState("");
  const [move, setMove] = useState("");
  let prevMoveComp = -1;
  let move1, move2, move3, move4;
  let current = 0;
  let currentComp = 0;
  let currMove = null;

  const handleChange = (event) => {
    const selected = event.target.value;
    const selectedPokemonObject = findPokemonByName(selected);

    event.target.classList.add("selected-button");
    event.target.disabled = true;

    setSelectedButtons((prevState) => [...prevState, selected]);
    if (selected !== undefined) {
      setSelectedPokeNum((prevState) => [
        ...prevState,
        selectedPokemonObject.num,
      ]);
      setSelectedPokemon((prevState) => [...prevState, selectedPokemonObject]);
    }

    if (selectedPokemon.length === 2 && selected !== undefined) {
      selectedPokeNum.push(selectedPokemonObject.num);
      setDisplay(true);
      displayFireType = false;
      displayGrassType = false;
      displayWaterType = false;
      displayFightingType = false;
      displayGhostType = false;
      displayDragonType = false;
      displayNormalType = false;
      displayPsychicType = false;
      displayPoisonType = false;
      displayElectricType = false;
      displayGroundType = false;
      setMove(null);
      generateOpponentPokemon();
    }
  };

  const handleImageClick = (name) => {
    const selectedPokemonObject = findPokemonByName(name);

    const selectedButton = document.querySelector(`button[value="${name}"]`);
    selectedButton.classList.add("selected-button");
    selectedButton.disabled = true;

    setSelectedButtons((prevState) => [...prevState, name]);

    setSelectedPokeNum((prevState) => [
      ...prevState,
      selectedPokemonObject.num,
    ]);
    setSelectedPokemon((prevState) => [...prevState, selectedPokemonObject]);

    if (selectedPokemon.length === 2) {
      selectedPokeNum.push(selectedPokemonObject.num);
      setDisplay(true);
      displayFireType = false;
      displayGrassType = false;
      displayWaterType = false;
      displayFightingType = false;
      displayGhostType = false;
      displayDragonType = false;
      displayNormalType = false;
      displayPsychicType = false;
      displayPoisonType = false;
      displayElectricType = false;
      displayGroundType = false;
      setMove(null);
      generateOpponentPokemon();
    }
  };

  const handleType = (event) => {
    const selected = event.target.value;
    setDisplayType(true);
    displayTypeChange(selected);
  };

  const displayTypeChange = (selected) => {
    if (selected === "Fire") {
      displayFireType = true;
    } else if (selected === "Grass") {
      displayGrassType = true;
    } else if (selected === "Water") {
      displayWaterType = true;
    } else if (selected === "Normal") {
      displayNormalType = true;
    } else if (selected === "Dragon") {
      displayDragonType = true;
    } else if (selected === "Ghost") {
      displayGhostType = true;
    } else if (selected === "Electric") {
      displayElectricType = true;
    } else if (selected === "Ground") {
      displayGroundType = true;
    } else if (selected === "Poison") {
      displayPoisonType = true;
    } else if (selected === "Psychic") {
      displayPsychicType = true;
    } else if (selected === "Fighting") {
      displayFightingType = true;
    }
  };

  const findPokemonByName = (name) => {
    for (let i = 0; i < pokemon.length; i++) {
      if (pokemon[i].name === name) {
        return pokemon[i];
      }
    }
    return null;
  };

  const generateOpponentPokemon = () => {
    const remainingNumbers = pokemon
      .map((poke) => poke.num)
      .filter((num) => !selectedPokeNum.includes(num));
    const randomNumbers = [];
    while (randomNumbers.length < 3) {
      let num =
        remainingNumbers[Math.floor(Math.random() * remainingNumbers.length)];
      while (selectedPokeNum.includes(num) || randomNumbers.includes(num)) {
        num =
          remainingNumbers[Math.floor(Math.random() * remainingNumbers.length)];
      }
      randomNumbers.push(num);
    }
    const randomPokemon = randomNumbers.map((num) =>
      pokemon.find((poke) => poke.num === num)
    );
    if (randomPokemon.length === 3) {
      setOpponentPokemon(randomPokemon);
    }
  };

  const calculateDamage = (attacker, move) => {
    let damage = attacker.moveDmg[move];

    if (attacker.moveAccuracy[move] !== 100) {
      let roll = Math.floor(Math.random() * 100) + 1;
      if (roll >= attacker.moveAccuracy[move]) {
        return 0;
      }
    }

    return Math.round(damage);
  };

  const effective = (num, attacker, defender) => {
    if (attacker.moveType[num] === "Fire") {
      if (defender.type === "Grass") {
        return 1;
      } else if (
        defender.type === "Water" ||
        defender.type === "Fire" ||
        defender.type === "Dragon" ||
        defender.type === "Rock"
      ) {
        return 3;
      } else {
        return 2;
      }
    } else if (attacker.moveType[num] === "Water") {
      if (
        defender.type === "Fire" ||
        defender.type === "Rock" ||
        defender.type === "Ground"
      ) {
        return 1;
      } else if (
        defender.type === "Water" ||
        defender.type === "Grass" ||
        defender.type === "Dragon"
      ) {
        return 3;
      } else {
        return 2;
      }
    } else if (attacker.moveType[num] === "Grass") {
      if (
        defender.type === "Water" ||
        defender.type === "Rock" ||
        defender.type === "Ground"
      ) {
        return 1;
      } else if (
        defender.type === "Grass" ||
        defender.type === "Fire" ||
        defender.type === "Dragon" ||
        defender.type === "Poison"
      ) {
        return 3;
      } else {
        return 2;
      }
    } else if (attacker.moveType[num] === "Psychic") {
      if (
        defender.type === "Fighting" ||
        defender.type === "Poison"
      ) {
        return 1;
      } else if (
        defender.type ===  "Psychic"
      ){
        return 3;
      } else{
        return 2;
      }
    } else if (attacker.moveType[num] === "Fighting") {
      if (defender.type === "Normal" || defender.type === "Rock") {
        return 1;
      } else if (defender.type === "Poison" || defender.type === "Psychic") {
        return 3;
      } else if (defender.type === "Ghost") {
        return 4;
      } else {
        return 2;
      }
    } else if (attacker.moveType[num] === "Ghost") {
      if (defender.type === "Psychic" || defender.type === "Ghost") {
        return 1;
      } else if (defender.type === "Normal") {
        return 4;
      } else {
        return 2;
      }
    } else if (attacker.moveType[num] === "Ground") {
      if (
        defender.type === "Fire" ||
        defender.type === "Electric" ||
        defender.type === "Poison" ||
        defender.type === "Rock"
      ) {
        return 1;
      } else if (defender.type === "Grass") {
        return 3;
      } else {
        return 2;
      }
    } else if (attacker.moveType[num] === "Electric") {
      if (
        defender.type === "Water"
      ) {
        return 1;
      } else if (
        defender.type === "Grass" ||
        defender.type === "Electric" ||
        defender.type === "Dragon"
      ) {
        return 3;
      } else {
        return 2;
      }
    } else if (attacker.moveType[num] === "Dragon") {
      if (defender.type === "Dragon") {
        return 1;
      } else {
        return 2;
      }
    } else if (attacker.moveType[num] === "Normal") {
      if (defender.type === "Rock") {
        return 3;
      } else if (defender.type === "Ghost") {
        return 4;
      } else {
        return 2;
      }
    } else if (attacker.moveType[num] === "Ice") {
      if (
        defender.type === "Grass" ||
        defender.type === "Ground" ||
        defender.type === "Dragon"
      ) {
        return 1;
      } else if (defender.type === "Water" || defender.type === "Fire") {
        return 3;
      } else {
        return 2;
      }
    } else if (attacker.moveType[num] === "Poison") {
      if (defender.type === "Grass") {
        return 1;
      } else if (defender.type === "Ground" || defender.type === "Ghost" || defender.type === "Poison") {
        return 3;
      } else {
        return 2;
      }
    } else if (attacker.moveType[num] === "Flying") {
      if (defender.type === "Grass" || defender.type === "Fighting") {
        return 1;
      } else if (defender.type === "Electric") {
        return 3;
      } else {
        return 2;
      }
    } else if (attacker.moveType[num] === "Rock") {
      if (defender.type === "Fire") {
        return 1;
      } else if (defender.type === "Fighting" || defender.type === "Ground") {
        return 3;
      } else {
        return 2;
      }
    } else if (attacker.moveType[num] === "Dark") {
      if (defender.type === "Ghost" || defender.type === "Psychic") {
        return 1;
      } else if (defender.type === "Fighting") {
        return 3;
      } else {
        return 2;
      }
    }
  };

  const moveEffect = () => {
    if (
      effective(0, selectedPokemon[current], opponentPokemon[currentComp]) === 1
    ) {
      move1 = " (effective)";
    } else if (
      effective(0, selectedPokemon[current], opponentPokemon[currentComp]) === 4
    ) {
      move1 = " (doesn't effect)";
    } else if (
      effective(0, selectedPokemon[current], opponentPokemon[currentComp]) === 3
    ) {
      move1 = " (not effective)";
    }
    if (
      effective(1, selectedPokemon[current], opponentPokemon[currentComp]) === 1
    ) {
      move2 = " (effective)";
    } else if (
      effective(1, selectedPokemon[current], opponentPokemon[currentComp]) === 4
    ) {
      move2 = " (doesn't effect)";
    } else if (
      effective(1, selectedPokemon[current], opponentPokemon[currentComp]) === 3
    ) {
      move2 = " (not effective)";
    }
    if (
      effective(2, selectedPokemon[current], opponentPokemon[currentComp]) === 1
    ) {
      move3 = "(effective)";
    } else if (
      effective(2, selectedPokemon[current], opponentPokemon[currentComp]) === 4
    ) {
      move3 = " (doesn't effect)";
    } else if (
      effective(2, selectedPokemon[current], opponentPokemon[currentComp]) === 3
    ) {
      move3 = " (not effective)";
    }
    if (
      effective(3, selectedPokemon[current], opponentPokemon[currentComp]) === 1
    ) {
      move4 = " (effective)";
    } else if (
      effective(3, selectedPokemon[current], opponentPokemon[currentComp]) === 4
    ) {
      move4 = " (doesn't effect)";
    } else if (
      effective(3, selectedPokemon[current], opponentPokemon[currentComp]) === 3
    ) {
      move4 = " (not effective)";
    }
  };

  const resetGame = () => {
    setSelectedPokemon([]);
    setOpponentPokemon([]);
    setSelectedButtons([]);
    setMove(null);
    setTextDisplay("");
    setDisplay(false);
    setDisplayType(false);
    current = 0;
    currentComp = 0;

    for (let i = 0; i < pokemon.length; i++) {
      pokemon[i].hp = pokemonData[i].hp;
    }


  };

  const userMove = (num) => {
    setPokeDeath("");
    setMoveMissFirst("");
    setMoveMissSecond("");

    currMove = num;
    setMove(currMove);
    battlePokemon();

    if (selectedPokemon.length === 0) {
      alert("You lose!");
      resetGame();
    } else if (opponentPokemon.length === 0) {
      alert("You win!");
      resetGame();
    }
  };

  const battlePokemon = () => {
    let currMoveComp;
    do {
      currMoveComp = Math.floor(Math.random() * 4);
    } while (currMoveComp === prevMoveComp);
    prevMoveComp = currMoveComp;
    let damage = calculateDamage(selectedPokemon[current], currMove);
    let compDamage = calculateDamage(
      opponentPokemon[currentComp],
      currMoveComp
    );

    let effectiveUser = effective(
      currMove,
      selectedPokemon[current],
      opponentPokemon[currentComp]
    );
    let effectiveComp = effective(
      currMoveComp,
      opponentPokemon[currentComp],
      selectedPokemon[current]
    );

    damage =
      effectiveUser === 1
        ? damage * 0.625
        : effectiveUser === 3
        ? damage * 0.375
        : effectiveUser === 4
        ? 0
        : damage / 2;
    damage = Math.round(damage);

    compDamage =
      effectiveComp === 1
        ? compDamage * 0.625
        : effectiveComp === 3
        ? compDamage * 0.375
        : effectiveComp === 4
        ? 0
        : compDamage / 2;
    compDamage = Math.round(compDamage);

    if (selectedPokemon[current].spd >= opponentPokemon[currentComp].spd) {
      opponentPokemon[currentComp].hp -= damage;
      if (opponentPokemon[currentComp].hp <= 0) {
        if (opponentPokemon.length === 1) {
          opponentPokemon.shift();
          return 0;
        }
        setPokeDeath(
          `${opponentPokemon[currentComp].name} has died. ${
            opponentPokemon[currentComp + 1].name
          } takes its place.`
        );
        setMoveFirst(
          `${selectedPokemon[current].name} used ${selectedPokemon[current].moves[currMove]}!`
        );
        setMoveSecond("");
        setMoveEffectiveSecond("");
        setMoveMissSecond("");
        setMoveEffectiveFirst(
          effective === 1
            ? "It was super effective!"
            : effective === 3
            ? "It wasn't very effective..."
            : ""
        );
        currentComp = currentComp + 1;
        opponentPokemon.shift();
        return 0;
      }
      selectedPokemon[current].hp -= compDamage;
      if (selectedPokemon[current].hp <= 0) {
        if (selectedPokemon.length === 1) {
          selectedPokemon.shift();
          return 0;
        }
        setPokeDeath(
          `${selectedPokemon[current].name} has died. ${
            selectedPokemon[current + 1].name
          } takes its place.`
        );
        setMoveSecond(
          `${opponentPokemon[currentComp].name} used ${opponentPokemon[currentComp].moves[currMoveComp]}!`
        );
        setMoveFirst(`${selectedPokemon[current].name} used ${selectedPokemon[current].moves[currMove]}!`);
        setMoveEffectiveFirst(
          effective === 1
            ? "It was super effective!"
            : effective === 3
            ? "It wasn't very effective..."
            : ""
        );
        setMoveMissFirst(
          damage === 0 && effectiveUser !== 4
            ? `${selectedPokemon[current].name} missed ${selectedPokemon[current].moves[currMove]}...`
            : ""
        );
        setMoveEffectiveSecond(
          effectiveComp === 1
            ? "It was super effective!"
            : effectiveComp === 3
            ? "It wasn't very effective..."
            : ""
        );
        current = current + 1;
        selectedPokemon.shift();
        return 0;
      }
      setMoveFirst(
        `${selectedPokemon[current].name} used ${selectedPokemon[current].moves[currMove]}!`
      );

      setMoveEffectiveFirst(
        effectiveUser === 1
          ? "It was super effective!"
          : effectiveUser === 3
          ? "It wasn't very effective..."
          : effectiveUser === 4
          ? `It doesn't affect ${opponentPokemon[currentComp].name}...`
          : ""
      );

      setMoveMissFirst(
        damage === 0 && effectiveUser !== 4
          ? `${selectedPokemon[current].name} missed ${selectedPokemon[current].moves[currMove]}...`
          : ""
      );

      setMoveSecond(
        `${opponentPokemon[currentComp].name} used ${opponentPokemon[currentComp].moves[currMoveComp]}!`
      );
      setMoveEffectiveSecond(
        effectiveComp === 1
          ? "It was super effective!"
          : effectiveComp === 3
          ? "It wasn't very effective..."
          : effectiveComp === 4
          ? `It doesn't affect ${selectedPokemon[current].name}...`
          : ""
      );
      setMoveMissSecond(
        compDamage === 0 && effectiveComp !== 4
          ? `${opponentPokemon[currentComp].name} missed ${opponentPokemon[currentComp].moves[currMoveComp]}...`
          : ""
      );
    } else {
      selectedPokemon[current].hp -= compDamage;
      if (selectedPokemon[current].hp <= 0) {
        if (selectedPokemon.length === 1) {
          selectedPokemon.shift();
          return 0;
        }
        setPokeDeath(
          `${selectedPokemon[current].name} has died. ${
            selectedPokemon[current + 1].name
          } takes its place.`
        );
        setMoveFirst(
          `${opponentPokemon[currentComp].name} used ${opponentPokemon[currentComp].moves[currMoveComp]}!`
        );
        setMoveSecond("");
        setMoveEffectiveSecond("");
        setMoveMissSecond("");
        setMoveEffectiveFirst(
          effectiveComp === 1
            ? "It was super effective!"
            : effectiveComp === 3
            ? "It wasn't very effective..."
            : ""
        );
        current = current + 1;
        selectedPokemon.shift();
        return 0;
      }
      opponentPokemon[currentComp].hp -= damage;
      if (opponentPokemon[currentComp].hp <= 0) {
        if (opponentPokemon.length === 1) {
          opponentPokemon.shift();
          return 0;
        }
        setPokeDeath(
          `${opponentPokemon[currentComp].name} has died. ${
            opponentPokemon[currentComp + 1].name
          } takes its place.`
        );
        setMoveFirst(
          `${opponentPokemon[currentComp].name} used ${opponentPokemon[currentComp].moves[currMoveComp]}!`
        );
        setMoveSecond(
          `${selectedPokemon[current].name} used ${selectedPokemon[current].moves[currMove]}!`
        );
        setMoveEffectiveSecond(
          effectiveUser === 1
            ? "It was super effective!"
            : effectiveUser === 3
            ? "It wasn't very effective..."
            : ""
        );
        setMoveMissSecond(
          damage === 0 && effectiveUser !== 4
            ? `${selectedPokemon[current].name} missed ${selectedPokemon[current].moves[currMove]}...`
            : ""
        );
        setMoveEffectiveFirst(
          effectiveComp === 1
            ? "It was super effective!"
            : effectiveComp === 3
            ? "It wasn't very effective..."
            : ""
        );
        currentComp = currentComp + 1;
        opponentPokemon.shift();
        return 0;
      }
      setMoveSecond(
        `${selectedPokemon[current].name} used ${selectedPokemon[current].moves[currMove]}!`
      );
      setMoveEffectiveSecond(
        effectiveUser === 1
          ? "It was super effective!"
          : effectiveUser === 3
          ? "It wasn't very effective..."
          : effectiveUser === 4
          ? `It doesn't affect ${opponentPokemon[currentComp].name}...`
          : ""
      );

      setMoveMissSecond(
        damage === 0 && effectiveUser !== 4
          ? `${selectedPokemon[current].name} missed ${selectedPokemon[current].moves[currMove]}...`
          : ""
      );

      setMoveFirst(
        `${opponentPokemon[currentComp].name} used ${opponentPokemon[currentComp].moves[currMoveComp]}!`
      );
      setMoveEffectiveFirst(
        effectiveComp === 1
          ? "It was super effective!"
          : effectiveComp === 3
          ? "It wasn't very effective..."
          : effectiveComp === 4
          ? `It doesn't affect ${selectedPokemon[current].name}...`
          : ""
      );
      setMoveMissFirst(
        compDamage === 0 && effectiveComp !== 4
          ? `${opponentPokemon[currentComp].name} missed ${opponentPokemon[currentComp].moves[currMoveComp]}...`
          : ""
      );
    }

    setSelectedPokemon([...selectedPokemon]);
    setOpponentPokemon([...opponentPokemon]);
  };

  const renderPokemonFire = () => {
    return pokemonFire.map((pokeFire) => (
      <button
        key={pokeFire.name}
        onClick={(event) => handleChange(event)}
        value={pokeFire.name}
        className={`pokemon-button ${selectedButtons.includes(pokeFire.name) ? "selected-button" : ""}`}
        style={{ position: "relative", width: "100px", height: "100px" }}
      >
        <img
          src={pokeFire.image}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            border: "none",
            background: "none",
            padding: 0,
            pointerEvents: "none",
          }}
          onClick={() => handleImageClick(pokeFire.name)}
        />
        <div
          style={{
            marginTop: "10px",
            fontWeight: "bold",
            pointerEvents: "none",
          }}
        >
          {pokeFire.name}
        </div>
      </button>
    ));
  };

  const renderPokemonWater = () => {
    return pokemonWater.map((pokeWater) => (
      <button
        key={pokeWater.name}
        onClick={(event) => handleChange(event)}
        value={pokeWater.name}
        className={`pokemon-button ${selectedButtons.includes(pokeWater.name) ? "selected-button" : ""}`}
        style={{ position: "relative", width: "100px", height: "100px" }}
      >
        <img
          src={pokeWater.image}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            border: "none",
            background: "none",
            padding: 0,
            pointerEvents: "none",
          }}
          onClick={() => handleImageClick(pokeWater.name)}
        />
        <div
          style={{
            marginTop: "10px",
            fontWeight: "bold",
            pointerEvents: "none",
          }}
        >
          {pokeWater.name}
        </div>
      </button>
    ));
  };

  const renderPokemonGrass = () => {
    return pokemonGrass.map((pokeGrass) => (
      <button
        key={pokeGrass.name}
        onClick={(event) => handleChange(event)}
        value={pokeGrass.name}
        className={`pokemon-button ${selectedButtons.includes(pokeGrass.name) ? "selected-button" : ""}`}
        style={{ position: "relative", width: "100px", height: "100px" }}
      >
        <img
          src={pokeGrass.image}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            border: "none",
            background: "none",
            padding: 0,
            pointerEvents: "none",
          }}
          onClick={() => handleImageClick(pokeGrass.name)}
        />
        <div
          style={{
            marginTop: "10px",
            fontWeight: "bold",
            pointerEvents: "none",
          }}
        >
          {pokeGrass.name}
        </div>
      </button>
    ));
  };

  const renderPokemonDragon = () => {
    return pokemonDragon.map((pokeDragon) => (
      <button
        key={pokeDragon.name}
        onClick={(event) => handleChange(event)}
        value={pokeDragon.name}
        className={`pokemon-button ${selectedButtons.includes(pokeDragon.name) ? "selected-button" : ""}`}
        style={{ position: "relative", width: "100px", height: "100px" }}
      >
        <img
          src={pokeDragon.image}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            border: "none",
            background: "none",
            padding: 0,
            pointerEvents: "none",
          }}
          onClick={() => handleImageClick(pokeDragon.name)}
        />
        <div
          style={{
            marginTop: "10px",
            fontWeight: "bold",
            pointerEvents: "none",
          }}
        >
          {pokeDragon.name}
        </div>
      </button>
    ));
  };

  const renderPokemonFighting = () => {
    return pokemonFighting.map((pokeFighting) => (
      <button
        key={pokeFighting.name}
        onClick={(event) => handleChange(event)}
        value={pokeFighting.name}
        className={`pokemon-button ${selectedButtons.includes(pokeFighting.name) ? "selected-button" : ""}`}
        style={{ position: "relative", width: "100px", height: "100px" }}
      >
        <img
          src={pokeFighting.image}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            border: "none",
            background: "none",
            padding: 0,
            pointerEvents: "none",
          }}
          onClick={() => handleImageClick(pokeFighting.name)}
        />
        <div
          style={{
            marginTop: "10px",
            fontWeight: "bold",
            pointerEvents: "none",
          }}
        >
          {pokeFighting.name}
        </div>
      </button>
    ));
  };

  const renderPokemonGround = () => {
    return pokemonGround.map((pokeGround) => (
      <button
        key={pokeGround.name}
        onClick={(event) => handleChange(event)}
        value={pokeGround.name}
        className={`pokemon-button ${selectedButtons.includes(pokeGround.name) ? "selected-button" : ""}`}
        style={{ position: "relative", width: "100px", height: "100px" }}
      >
        <img
          src={pokeGround.image}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            border: "none",
            background: "none",
            padding: 0,
            pointerEvents: "none",
          }}
          onClick={() => handleImageClick(pokeGround.name)}
        />
        <div
          style={{
            marginTop: "10px",
            fontWeight: "bold",
            pointerEvents: "none",
          }}
        >
          {pokeGround.name}
        </div>
      </button>
    ));
  };

  const renderPokemonGhost = () => {
    return pokemonGhost.map((pokeGhost) => (
      <button
        key={pokeGhost.name}
        onClick={(event) => handleChange(event)}
        value={pokeGhost.name}
        className={`pokemon-button ${selectedButtons.includes(pokeGhost.name) ? "selected-button" : ""}`}
        style={{ position: "relative", width: "100px", height: "100px" }}
      >
        <img
          src={pokeGhost.image}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            border: "none",
            background: "none",
            padding: 0,
            pointerEvents: "none",
          }}
          onClick={() => handleImageClick(pokeGhost.name)}
        />
        <div
          style={{
            marginTop: "10px",
            fontWeight: "bold",
            pointerEvents: "none",
          }}
        >
          {pokeGhost.name}
        </div>
      </button>
    ));
  };

  const renderPokemonPoison = () => {
    return pokemonPoison.map((pokePoison) => (
      <button
        key={pokePoison.name}
        onClick={(event) => handleChange(event)}
        value={pokePoison.name}
        className={`pokemon-button ${selectedButtons.includes(pokePoison.name) ? "selected-button" : ""}`}
        style={{ position: "relative", width: "100px", height: "100px" }}
      >
        <img
          src={pokePoison.image}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            border: "none",
            background: "none",
            padding: 0,
            pointerEvents: "none",
          }}
          onClick={() => handleImageClick(pokePoison.name)}
        />
        <div
          style={{
            marginTop: "10px",
            fontWeight: "bold",
            pointerEvents: "none",
          }}
        >
          {pokePoison.name}
        </div>
      </button>
    ));
  };

  const renderPokemonNormal = () => {
    return pokemonNormal.map((pokeNormal) => (
      <button
        key={pokeNormal.name}
        onClick={(event) => handleChange(event)}
        value={pokeNormal.name}
        className={`pokemon-button ${selectedButtons.includes(pokeNormal.name) ? "selected-button" : ""}`}
        style={{ position: "relative", width: "100px", height: "100px" }}
      >
        <img
          src={pokeNormal.image}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            border: "none",
            background: "none",
            padding: 0,
            pointerEvents: "none",
          }}
          onClick={() => handleImageClick(pokeNormal.name)}
        />
        <div
          style={{
            marginTop: "10px",
            fontWeight: "bold",
            pointerEvents: "none",
          }}
        >
          {pokeNormal.name}
        </div>
      </button>
    ));
  };

  const renderPokemonElectric = () => {
    return pokemonElectric.map((pokeElectric) => (
      <button
        key={pokeElectric.name}
        onClick={(event) => handleChange(event)}
        value={pokeElectric.name}
        className={`pokemon-button ${selectedButtons.includes(pokeElectric.name) ? "selected-button" : ""}`}
        style={{ position: "relative", width: "100px", height: "100px" }}
      >
        <img
          src={pokeElectric.image}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            border: "none",
            background: "none",
            padding: 0,
            pointerEvents: "none",
          }}
          onClick={() => handleImageClick(pokeElectric.name)}
        />
        <div
          style={{
            marginTop: "10px",
            fontWeight: "bold",
            pointerEvents: "none",
          }}
        >
          {pokeElectric.name}
        </div>
      </button>
    ));
  };

  const renderPokemonPsychic = () => {
    return pokemonPsychic.map((pokePsychic) => (
      <button
        key={pokePsychic.name}
        onClick={(event) => handleChange(event)}
        value={pokePsychic.name}
        className={`pokemon-button ${selectedButtons.includes(pokePsychic.name) ? "selected-button" : ""}`}
        style={{ position: "relative", width: "100px", height: "100px" }}
      >
        <img
          src={pokePsychic.image}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            border: "none",
            background: "none",
            padding: 0,
            pointerEvents: "none",
          }}
          onClick={() => handleImageClick(pokePsychic.name)}
        />
        <div
          style={{
            marginTop: "10px",
            fontWeight: "bold",
            pointerEvents: "none",
          }}
        >
          {pokePsychic.name}
        </div>
      </button>
    ));
  };

  let pokemonDisplay, moveDisplay;
  if (display) {
    const pokemonNames = selectedPokemon.map((pokemon) => pokemon.name);
    const opponentNames = opponentPokemon.map((pokemon) => pokemon.name);
    let hpPercent =
      (selectedPokemon[current].hp / selectedPokemon[current].maxHp) * 100;
    let hpBal = 100 - hpPercent;
    let hpPercentComp =
      (opponentPokemon[currentComp].hp / opponentPokemon[currentComp].maxHp) *
      100;
    let hpBalComp = 100 - hpPercentComp;

    const color =
      hpBal > 75
        ? "rgb(247, 94, 83)"
        : hpBal > 50
        ? "rgb(247, 234, 53)"
        : "rgb(51, 209, 51)";
    const hpLeftStyle = { backgroundColor: color };
    const colorComp =
      hpBalComp > 75
        ? "rgb(247, 94, 83)"
        : hpBalComp > 50
        ? "rgb(247, 234, 53)"
        : "rgb(51, 209, 51)";
    const hpLeftStyleComp = { backgroundColor: colorComp };

    moveEffect();
    pokemonDisplay = (
      <div className="battle-screen">
        <hr1>
          <div
            style={{
              fontSize: 32,
              background: "rgb(62, 133, 62)",
              fontWeight: "bold",
            }}
          >
            Your Pokemon: {pokemonNames.join(", ")}
          </div>
          {display && (
            <div
              className="PokemonFont"
              style={{ fontSize: 32, background: "rgb(4, 37, 3)" }}
            >
              vs. {opponentNames.join(", ")}
            </div>
          )}
        </hr1>
        <div className="stats-container" style={{ marginTop: 32 }}>
          <div className="left-image">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={selectedPokemon[current].backImage}
                style={{
                  maxWidth: "80%",
                  height: "225px",
                  marginLeft: 25,
                  marginTop: -100,
                }}
              />
              <div
                className="health-screen"
                style={{ marginTop: 40, marginLeft: 925 }}
              >
                <div className="name" style={{ marginTop: -50, marginLeft: 0 }}>
                  {selectedPokemon[current].name}
                </div>
                <div
                  className="hp"
                  style={{ marginTop: 20, fontWeight: "bold" }}
                >
                  HP: {selectedPokemon[current].hp}/
                  {selectedPokemon[current].maxHp}
                </div>
                <div className="hpBar" style={{ marginLeft: -50 }}>
                  <div
                    className="hpSection hpLeft"
                    style={{ width: hpPercent + "%", ...hpLeftStyle }}
                  ></div>
                  <div
                    id="hpDealt"
                    className="hpSection hpDealt"
                    style={{ width: hpBal + "%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="right-image">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={opponentPokemon[currentComp].image}
                style={{
                  maxWidth: "80%",
                  height: "225px",
                  marginLeft: 1575,
                  marginTop: -30,
                }}
              />
              <div
                className="health-screen"
                style={{ marginTop: -15, marginLeft: 650 }}
              >
                <div className="name" style={{ marginTop: -50, marginLeft: 0 }}>
                  {opponentPokemon[currentComp].name}
                </div>
                <div
                  className="hpComp"
                  style={{ marginTop: 20, fontWeight: "bold" }}
                >
                  HP: {opponentPokemon[currentComp].hp}/
                  {opponentPokemon[currentComp].maxHp}
                </div>
                <div className="hpBarComp" style={{ marginLeft: -40 }}>
                  <div
                    className="hpSectionComp hpLeftComp"
                    style={{ width: hpPercentComp + "%", ...hpLeftStyleComp }}
                  ></div>
                  <div
                    id="hpDealtComp"
                    className="hpSectionComp hpDealtComp"
                    style={{ width: hpBalComp + "%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    moveDisplay = (
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
          width: "1000px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <button
            style={{ width: "100%", height: "65px" }}
            onClick={() => {
              userMove(0);
            }}
          >
            {selectedPokemon[current].moves[0]} {move1}
          </button>
          <button
            style={{ width: "100%", height: "65px" }}
            onClick={() => {
              userMove(1);
            }}
          >
            {selectedPokemon[current].moves[1]} {move2}
          </button>
          <button
            style={{ width: "100%", height: "65px" }}
            onClick={() => {
              userMove(2);
            }}
          >
            {selectedPokemon[current].moves[2]} {move3}
          </button>
          <button
            style={{ width: "100%", height: "65px" }}
            onClick={() => {
              userMove(3);
            }}
          >
            {selectedPokemon[current].moves[3]} {move4}
          </button>
        </div>
      </div>
    );
  }

  const renderPokemonTypes = () => {
    return pokemonType.map((pokeType) => (
      <button
        key={pokeType.type}
        onClick={(event) => handleType(event)}
        value={pokeType.type}
        className="pokemon-button"
        style={{
          position: "relative",
          width: "90px",
          height: "35px",
          backgroundColor: pokeType.color,
          fontWeight: "bold",
          borderRadius: 20,
          textAlign: "center",
          boxShadow: "0 0 0 2px white, 0 0 0 4px black",
          textTransform: "uppercase",
          lineHeight: "12px",
          color: "white",
          textShadow: "0 0 10px black",
        }}
      >
        {pokeType.type}
      </button>
    ));
  };

  useEffect(() => {
    if (move !== "" && move !== null) {
      let moveEffectiveFirstDelay,
        moveMissFirstDelay,
        moveEffectiveSecondDelay,
        moveMissSecondDelay,
        pokeDeathDelay;
      if (moveEffectiveFirst === "" || moveEffectiveFirst === null) {
        moveEffectiveFirstDelay = 0;
      } else {
        moveEffectiveFirstDelay = 1000;
      }
      if (moveMissFirst === "" || moveMissFirst === null) {
        moveMissFirstDelay = 0;
      } else {
        moveMissFirstDelay = 1000;
      }
      if (moveEffectiveSecond === "" || moveEffectiveSecond === null) {
        moveEffectiveSecondDelay = 0;
      } else {
        moveEffectiveSecondDelay = 1000;
      }
      if (moveMissSecond === "" || moveMissSecond === null) {
        moveMissSecondDelay = 0;
      } else {
        moveMissSecondDelay = 1000;
      }
      if (pokeDeath === "" || pokeDeath === null) {
        pokeDeathDelay = 0;
      } else {
        pokeDeathDelay = 1000;
      }

      if (moveEffectiveFirst !== "" && moveEffectiveFirst !== null) {
        if (moveMissFirst !== "" && moveMissFirst !== null) {
          setMoveEffectiveFirst("");
        }
      }
      if (moveEffectiveSecond !== "" && moveEffectiveSecond !== null) {
        if (moveMissSecond !== "" && moveMissSecond !== null) {
          setMoveEffectiveSecond("");
        }
      }

      setTextDisplay(
        <div
          className="health-screen"
          style={{
            position: "absolute",
            bottom: 225,
            left: "50%",
            transform: "translateX(-50%)",
            width: "1000px",
            margin: "0 auto",
            height: "100px",
          }}
        >
          <div style={{ fontSize: 32, loop: true }}>
            <Typewriter
              key={
                moveFirst +
                moveEffectiveFirst +
                moveMissFirst +
                moveSecond +
                moveEffectiveSecond +
                moveMissSecond
              }
              options={{ delay: 25 }}
              onInit={(typewriter) => {
                typewriter
                  .typeString(moveFirst)
                  .pauseFor(1000)
                  .deleteAll(-10000)
                  .typeString(moveEffectiveFirst)
                  .pauseFor(moveEffectiveFirstDelay)
                  .deleteAll(-10000)
                  .typeString(moveMissFirst)
                  .pauseFor(moveMissFirstDelay)
                  .deleteAll(-10000)
                  .typeString(moveSecond)
                  .pauseFor(1000)
                  .deleteAll(-10000)
                  .typeString(moveEffectiveSecond)
                  .pauseFor(moveEffectiveSecondDelay)
                  .deleteAll(-10000)
                  .typeString(moveMissSecond)
                  .pauseFor(moveMissSecondDelay)
                  .deleteAll(-10000)
                  .typeString(pokeDeath)
                  .pauseFor(pokeDeathDelay)
                  .deleteAll(-10000)
                  .start();
              }}
            />
          </div>
        </div>
      );
    }
  }, [
    moveFirst,
    moveMissFirst,
    moveEffectiveFirst,
    moveSecond,
    moveMissSecond,
    moveEffectiveSecond,
    prevMoveComp,
  ]);

  return (
    <div
      style={{
        backgroundImage: "url(https://wallpaperaccess.com/full/3551101.png)",
      }}
    >
      <div className="App">
        {!display && (
          <div className="loading-screen">
            <div
              className="PokemonFont"
              style={{
                background: "red",
                color: "black",
                fontSize: 32,
                fontWeight: "bold",
              }}
            >
              Welcome to Pokemon Diamond!
            </div>
            <div
              className="PokemonFont"
              style={{ background: "black", fontSize: 28 }}
            >
              Choose your pokemon.
            </div>

            {selectedPokemon.length > 0 && (
              <div
                style={{
                  fontSize: 32,
                  background: "rgb(62, 133, 62)",
                  fontWeight: "bold",
                  backgroundColor: "white",
                }}
              >
                Your Pokemon: {selectedPokemon.map((pokemon) => pokemon.name).join(", ")}
              </div>
            )}

            {!displayType && (
              <div className="button-type-container">
                <div
                  className="button-row"
                  style={{ marginTop: 60, marginBottom: 30 }}
                >
                  {renderPokemonTypes().slice(0, 6)}
                </div>
                <div className="button-row">
                  {renderPokemonTypes().slice(6)}
                </div>
              </div>
            )}

            {selectedPokemon.length > 0 && (
              <div>
                <button className="reset-button" style={{marginTop: 47, marginRight: 700, fontSize: 28, fontWeight: "bold"}}
                  onClick={() => {
                    setSelectedPokemon([]);
                    setSelectedButtons([]);
                    setDisplay(false);
                    setDisplayType(false);
                  }}
                > 
                  Reset
                </button>
              </div>
            )}
          </div>
        )}
        {displayFireType && (
          <div className="loading-screen">
          <div
            className="PokemonFont"
            style={{
              background: "red",
              color: "black",
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            Welcome to Pokemon Diamond!
          </div>
          <div className="PokemonFont" style={{ background: "black", fontSize: 28 }}>
            Choose your pokemon.
          </div>
          <button style={{ marginTop: 15, marginRight: 700, fontSize: 28 }}
                  onClick={() => {
                    setDisplayType(false);
                    displayFireType = false;
                  }}
          > 
            Back
          </button>
          <div className="button-type-container">
            <div className="button-row" style={{ marginTop: 20, marginBottom: 30 }}>
              {renderPokemonFire().slice(0)}
            </div>
          </div>
          <button className = "reset-button" style={{ marginTop: 105, marginRight: 700, fontSize: 28, fontWeight: "bold"}}
                  onClick={() => {
                    setSelectedPokemon([]);
                    setSelectedButtons([]);
                    setDisplay(false);
                    setDisplayType(false);
                    displayFireType = false;
                  }}
          > 
            Reset
          </button>
        </div>
          
        )}
        {displayWaterType && (
          <div className="loading-screen">
          <div
            className="PokemonFont"
            style={{
              background: "red",
              color: "black",
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            Welcome to Pokemon Diamond!
          </div>
          <div className="PokemonFont" style={{ background: "black", fontSize: 28 }}>
            Choose your pokemon.
          </div>
          <button style={{ marginTop: 15, marginRight: 700, fontSize: 28 }}
                  onClick={() => {
                    setDisplayType(false);
                    displayWaterType = false;
                  }}
          > 
            Back
          </button>
          <div className="button-type-container">
            <div className="button-row" style={{ marginTop: -50, marginBottom: 30 }}>
              {renderPokemonWater().slice(0, 3)}
            </div>
            <div className="button-row">
              {renderPokemonWater().slice(3)}
            </div>
          </div>
          <button className = "reset-button" style={{ marginTop: 30, marginRight: 700, fontSize: 28, fontWeight: "bold"}}
                  onClick={() => {
                    setSelectedPokemon([]);
                    setSelectedButtons([]);
                    setDisplay(false);
                    setDisplayType(false);
                    displayWaterType = false;
                  }}
          > 
            Reset
          </button>
        </div>
          
        )}
        {displayGrassType && (
          <div className="loading-screen">
          <div
            className="PokemonFont"
            style={{
              background: "red",
              color: "black",
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            Welcome to Pokemon Diamond!
          </div>
          <div className="PokemonFont" style={{ background: "black", fontSize: 28 }}>
            Choose your pokemon.
          </div>
          <button style={{ marginTop: 15, marginRight: 700, fontSize: 28 }}
                  onClick={() => {
                    setDisplayType(false);
                    displayGrassType = false;
                  }}
          > 
            Back
          </button>
          <div className="button-type-container">
            <div className="button-row" style={{ marginTop: 20, marginBottom: 30 }}>
              {renderPokemonGrass().slice(0)}
            </div>
          </div>
          <button className = "reset-button" style={{ marginTop: 105, marginRight: 700, fontSize: 28, fontWeight: "bold"}}
                  onClick={() => {
                    setSelectedPokemon([]);
                    setSelectedButtons([]);
                    setDisplay(false);
                    setDisplayType(false);
                    displayGrassType = false;
                  }}
          > 
            Reset
          </button>
        </div>
          
        )}
        {displayGroundType && (
          <div className="loading-screen">
          <div
            className="PokemonFont"
            style={{
              background: "red",
              color: "black",
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            Welcome to Pokemon Diamond!
          </div>
          <div className="PokemonFont" style={{ background: "black", fontSize: 28 }}>
            Choose your pokemon.
          </div>
          <button style={{ marginTop: 15, marginRight: 700, fontSize: 28 }}
                  onClick={() => {
                    setDisplayType(false);
                    displayGroundType = false;
                  }}
          > 
            Back
          </button>
          <div className="button-type-container">
            <div className="button-row" style={{ marginTop: 20, marginBottom: 30 }}>
              {renderPokemonGround().slice(0)}
            </div>
          </div>
          <button className = "reset-button" style={{ marginTop: 105, marginRight: 700, fontSize: 28, fontWeight: "bold"}}
                  onClick={() => {
                    setSelectedPokemon([]);
                    setSelectedButtons([]);
                    setDisplay(false);
                    setDisplayType(false);
                    displayGroundType = false;
                  }}
          > 
            Reset
          </button>
        </div>
          
        )}
        {displayPsychicType && (
          <div className="loading-screen">
          <div
            className="PokemonFont"
            style={{
              background: "red",
              color: "black",
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            Welcome to Pokemon Diamond!
          </div>
          <div className="PokemonFont" style={{ background: "black", fontSize: 28 }}>
            Choose your pokemon.
          </div>
          <button style={{ marginTop: 15, marginRight: 700, fontSize: 28 }}
                  onClick={() => {
                    setDisplayType(false);
                    displayPsychicType = false;
                  }}
          > 
            Back
          </button>
          <div className="button-type-container">
            <div className="button-row" style={{ marginTop: 20, marginBottom: 30 }}>
              {renderPokemonPsychic().slice(0)}
            </div>
          </div>
          <button className = "reset-button" style={{ marginTop: 105, marginRight: 700, fontSize: 28, fontWeight: "bold"}}
                  onClick={() => {
                    setSelectedPokemon([]);
                    setSelectedButtons([]);
                    setDisplay(false);
                    setDisplayType(false);
                    displayPsychicType = false;
                  }}
          > 
            Reset
          </button>
        </div>
          
        )}
        {displayGhostType && (
          <div className="loading-screen">
          <div
            className="PokemonFont"
            style={{
              background: "red",
              color: "black",
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            Welcome to Pokemon Diamond!
          </div>
          <div className="PokemonFont" style={{ background: "black", fontSize: 28 }}>
            Choose your pokemon.
          </div>
          <button style={{ marginTop: 15, marginRight: 700, fontSize: 28 }}
                  onClick={() => {
                    setDisplayType(false);
                    displayGhostType = false;
                  }}
          > 
            Back
          </button>
          <div className="button-type-container">
            <div className="button-row" style={{ marginTop: 20, marginBottom: 30 }}>
              {renderPokemonGhost().slice(0)}
            </div>
          </div>
          <button className = "reset-button" style={{ marginTop: 105, marginRight: 700, fontSize: 28, fontWeight: "bold"}}
                  onClick={() => {
                    setSelectedPokemon([]);
                    setSelectedButtons([]);
                    setDisplay(false);
                    setDisplayType(false);
                    displayGhostType = false;
                  }}
          > 
            Reset
          </button>
        </div>
          
        )}
        {displayFightingType && (
          <div className="loading-screen">
          <div
            className="PokemonFont"
            style={{
              background: "red",
              color: "black",
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            Welcome to Pokemon Diamond!
          </div>
          <div className="PokemonFont" style={{ background: "black", fontSize: 28 }}>
            Choose your pokemon.
          </div>
          <button style={{ marginTop: 15, marginRight: 700, fontSize: 28 }}
                  onClick={() => {
                    setDisplayType(false);
                    displayFightingType = false;
                  }}
          > 
            Back
          </button>
          <div className="button-type-container">
            <div className="button-row" style={{ marginTop: 20, marginBottom: 30 }}>
              {renderPokemonFighting().slice(0)}
            </div>
          </div>
          <button className = "reset-button" style={{ marginTop: 105, marginRight: 700, fontSize: 28, fontWeight: "bold"}}
                  onClick={() => {
                    setSelectedPokemon([]);
                    setSelectedButtons([]);
                    setDisplay(false);
                    setDisplayType(false);
                    displayFightingType = false;
                  }}
          > 
            Reset
          </button>
        </div>
          
        )}
        {displayDragonType && (
          <div className="loading-screen">
          <div
            className="PokemonFont"
            style={{
              background: "red",
              color: "black",
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            Welcome to Pokemon Diamond!
          </div>
          <div className="PokemonFont" style={{ background: "black", fontSize: 28 }}>
            Choose your pokemon.
          </div>
          <button style={{ marginTop: 15, marginRight: 700, fontSize: 28 }}
                  onClick={() => {
                    setDisplayType(false);
                    displayDragonType = false;
                  }}
          > 
            Back
          </button>
          <div className="button-type-container">
            <div className="button-row" style={{ marginTop: 20, marginBottom: 30 }}>
              {renderPokemonDragon().slice(0)}
            </div>
          </div>
          <button className = "reset-button" style={{ marginTop: 105, marginRight: 700, fontSize: 28, fontWeight: "bold"}}
                  onClick={() => {
                    setSelectedPokemon([]);
                    setSelectedButtons([]);
                    setDisplay(false);
                    setDisplayType(false);
                    displayDragonType = false;
                  }}
          > 
            Reset
          </button>
        </div>
          
        )}
        {displayPoisonType && (
          <div className="loading-screen">
          <div
            className="PokemonFont"
            style={{
              background: "red",
              color: "black",
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            Welcome to Pokemon Diamond!
          </div>
          <div className="PokemonFont" style={{ background: "black", fontSize: 28 }}>
            Choose your pokemon.
          </div>
          <button style={{ marginTop: 15, marginRight: 700, fontSize: 28 }}
                  onClick={() => {
                    setDisplayType(false);
                    displayPoisonType = false;
                  }}
          > 
            Back
          </button>
          <div className="button-type-container">
            <div className="button-row" style={{ marginTop: 20, marginBottom: 30 }}>
              {renderPokemonPoison().slice(0)}
            </div>
          </div>
          <button className = "reset-button" style={{ marginTop: 105, marginRight: 700, fontSize: 28, fontWeight: "bold"}}
                  onClick={() => {
                    setSelectedPokemon([]);
                    setSelectedButtons([]);
                    setDisplay(false);
                    setDisplayType(false);
                    displayPoisonType = false;
                  }}
          > 
            Reset
          </button>
        </div>
          
        )}
        {displayNormalType && (
          <div className="loading-screen">
          <div
            className="PokemonFont"
            style={{
              background: "red",
              color: "black",
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            Welcome to Pokemon Diamond!
          </div>
          <div className="PokemonFont" style={{ background: "black", fontSize: 28 }}>
            Choose your pokemon.
          </div>
          <button style={{ marginTop: 15, marginRight: 700, fontSize: 28 }}
                  onClick={() => {
                    setDisplayType(false);
                    displayNormalType = false;
                  }}
          > 
            Back
          </button>
          <div className="button-type-container">
            <div className="button-row" style={{ marginTop: 20, marginBottom: 30 }}>
              {renderPokemonNormal().slice(0)}
            </div>
          </div>
          <button className = "reset-button" style={{ marginTop: 105, marginRight: 700, fontSize: 28, fontWeight: "bold"}}
                  onClick={() => {
                    setSelectedPokemon([]);
                    setSelectedButtons([]);
                    setDisplay(false);
                    setDisplayType(false);
                    displayNormalType = false;
                  }}
          > 
            Reset
          </button>
        </div>
          
        )}
        {displayElectricType && (
          <div className="loading-screen">
          <div
            className="PokemonFont"
            style={{
              background: "red",
              color: "black",
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            Welcome to Pokemon Diamond!
          </div>
          <div className="PokemonFont" style={{ background: "black", fontSize: 28 }}>
            Choose your pokemon.
          </div>
          <button style={{ marginTop: 15, marginRight: 700, fontSize: 28 }}
                  onClick={() => {
                    setDisplayType(false);
                    displayElectricType = false;
                  }}
          > 
            Back
          </button>
          <div className="button-type-container">
            <div className="button-row" style={{ marginTop: 20, marginBottom: 30 }}>
              {renderPokemonElectric().slice(0)}
            </div>
          </div>
          <button className = "reset-button" style={{ marginTop: 105, marginRight: 700, fontSize: 28, fontWeight: "bold"}}
                  onClick={() => {
                    setSelectedPokemon([]);
                    setSelectedButtons([]);
                    setDisplay(false);
                    setDisplayType(false);
                    displayElectricType = false;
                  }}
          > 
            Reset
          </button>
        </div>
          
        )}
        {pokemonDisplay}
        {textDisplay}
        {moveDisplay}
      </div>
    </div>
  );
}

export default App;
