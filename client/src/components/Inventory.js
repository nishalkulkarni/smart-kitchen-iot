import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

import RecipeCard from "./RecipeCard";

import useFirestore from "../hooks/useFirestore";

export default function Inventory(props) {
  const [invList, setInvList] = useState([{}]);
  const [ingred, setIngred] = useState([]);
  const [recipeData, setRecipeData] = useState(null);
  const [lastSynch, setLastSynch] = useState(null);

  //Pulls the documents in collection called 'inventory'
  const { docs } = useFirestore("inventory");

  useEffect(() => {
    setLastSynch(Date().toLocaleString());
  }, [docs]);

  // Current Format of the ingredients, extremely basic
  let tempList = [
    {
      name: "apple",
      unit: "cups",
      value: 3,
    },
    {
      name: "flour",
      unit: "mg",
      value: 100,
    },
    {
      name: "milk",
      unit: "ml",
      value: 400,
    },
  ];

  async function getAvailableRecipes() {
    await makeIngredQuery();

    getRecipeByIng();
  }

  function makeIngredQuery() {
    return new Promise((resolve, reject) => {
      setIngred(
        tempList.map((item) => {
          return item.name;
        })
      );
      if (ingred != null) {
        resolve();
      }
    });
  }

  function getRecipeByIng() {
    let ingredQuery = "";
    ingred.forEach((ingredient) => {
      ingredQuery += ingredient;
      ingredQuery += ",";
    });
    if (!ingredQuery) {
      alert("Please try again!");
      return;
    }
    fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${process.env.REACT_APP_SPOON_API_KEY}&ingredients=${ingredQuery}&number=5`
    )
      .then((res) => res.json())
      .then((data) => {
        let titles = [];
        data.forEach((recipe) => {
          titles.push(recipe.title);
        });
        if (!data) alert("Sorry, could not find any matches");
        setRecipeData(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const inventoryList = {
    backgroundColor: "rgba(245,255,253,0.5)",
    overflowY: "scroll",
    minHeight: "400px",
    display: "flex",
    flexDirection: "row",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundBlendMode: "darken",
  };

  return (
    <Grid item xs={12}>
      <h1 className="sbi-header">Your Produce Inventory</h1>
      <h2
        className="sbi-label"
        style={{ backgroundColor: "white", borderRadius: "15px" }}
      >
        Last Synched to{" "}
        <img
          src="https://firebase.google.com/downloads/brand-guidelines/PNG/logo-standard.png"
          width="71px"
          height="20px"
        ></img>{" "}
        : {lastSynch}
      </h2>
      <div style={{ boxShadow: "5px", border: "2px solid black" }}>
        <GridList cellHeight={160} cols={3} style={inventoryList}>
          {docs.map((item) => (
            <div>
              <img src={item.produce.image} width="200px" style={{marginTop: "20px"}}/>
              <GridListTile>
                {" "}
                <h2 className="invlist-label">{item.produce.name}</h2>{" "}
                <b>
                  {item.produce.value} {item.produce.unit}
                </b>{" "}
              </GridListTile>
            </div>
          ))}
        </GridList>
      </div>
      <div>
        <button className="button-default" onClick={getAvailableRecipes}>
          Available Recipes
        </button>
      </div>
      <div className="recipe-cards-div">
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
