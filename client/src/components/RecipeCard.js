import React, { useState } from "react";
function RecipeCard(props) {
  //getRecipeById(props.id);
  return (
    <div className="recipe-card">
      <div className="recipe-preview">
        <h1>{props.title}</h1>
        <img src={props.imageURL}></img>
      </div>
      <div className="recipe-info-panel">
        {props.title && <h2>Information</h2>}
        {props.title && <h3>All Ingredients</h3>}
        {props.title &&
          props.recipe.usedIngredients.map((ing) => {
            return (
              <p key={ing.id}>
                {ing.name} : {ing.amount.toFixed(2)} {ing.unit}
              </p>
            );
          })}

        {props.title &&
          props.recipe.missedIngredients.map((ing) => {
            return (
              <p key={ing.id}>
                {ing.name} : {ing.amount.toFixed(2)} {ing.unit}
              </p>
            );
          })}
      </div>
    </div>
  );
}

export default RecipeCard;
