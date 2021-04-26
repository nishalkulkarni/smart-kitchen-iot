import React, { useState } from "react";
import RecipeCard from "./RecipeCard";

import Grid from "@material-ui/core/Grid";
//TODO send full recipe object thru carefully
export default function SearchByIng(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [ingred, setIngred] = useState([]);
  const [recipeData, setRecipeData] = useState([{}]);

  function getRecipeById() {
    let ingredQuery = "";
    ingred.forEach((ingredient) => {
      ingredQuery += ingredient;
      ingredQuery += ",";
      //console.log(ingredQuery);
    });
    if (!ingredQuery) {
      alert("Please check input!");
      return;
    }
    fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${process.env.REACT_APP_SPOON_API_KEY}&ingredients=${ingredQuery}&number=5`
    )
      .then((res) => res.json())
      .then((data) => {
        //setRecipeData(data);
        let titles = [];
        data.forEach((recipe) => {
          titles.push(recipe.title);
        });
        if (!data) alert("Sorry, could not find any matches");
        setRecipeData(data);

        console.log(recipeData);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    getRecipeById();
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const addIngredient = (e) => {
    e.preventDefault();
    //console.log('addo')
    if (!searchTerm) return;
    setIngred((arr) => [...arr, searchTerm]);
    setSearchTerm("");
  };

  const removeIngred = (e, ingredient) => {
    e.preventDefault();

    setIngred((arr) => arr.splice(arr.indexOf(ingredient), 1));
    console.log(ingred);
  };

  const ingredientCard = {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "blueviolet",
    fontSize: "25px",
    color: "white",
    width: "fit-content",
    padding: "5px",
    margin: "5px",
    borderRadius: "5px",
  };

  const removeButton = {
    backgroundColor: "blueviolet",
    fontSize: "25px",
    color: "red",
    boxShadow: "0px",
    border: "none",
    marginLeft: "10px",
  };
  const ingredientsDiv = {
    display: "flex",
    flexDirection: "row",
    padding: "5px",
  };
  return (
    <Grid item xs={12}>
      <div>
        <h1 style={{ fontFamily: "Verdana, Geneva, Tahoma, sans-serif" }}>
          Search For Recipe using Ingredients!
        </h1>
        <form>
          <label style={{ fontFamily: "Verdana, Geneva, Tahoma, sans-serif" }}>
            Enter ingredient to add :{" "}
          </label>
          <input
            id="inputIngredient"
            type="text"
            value={searchTerm}
            onChange={handleChange}
          ></input>

          <button
            type="submit"
            onClick={addIngredient}
            className="button-default"
          >
            Add
          </button>
          <button onClick={handleSubmit} className="button-default">
            Search
          </button>
        </form>
        <div className="ingredients-div">
          <h2>Ingredients:</h2>
          {ingred &&
            ingred.map((ingredient) => {
              return (
                <div style={ingredientCard}>
                  {ingredient}
                  <button
                    onClick={(e) => removeIngred(e, ingredient)}
                    style={removeButton}
                  >
                    {" "}
                    -{" "}
                  </button>
                </div>
              );
            })}
        </div>

        {recipeData &&
          recipeData.map((recipe) => {
            return (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                imageURL={recipe.image}
                recipe={recipe}
                missedIngredients={recipe.missedIngredients}
              />
            );
          })}
      </div>
    </Grid>
  );
}
