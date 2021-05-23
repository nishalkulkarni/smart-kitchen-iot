import React, { useState } from "react";
import RecipeCard from "./RecipeCard";
import { motion } from "framer-motion";
import Grid from "@material-ui/core/Grid";
import { projectFirestore } from "../firebase/config";
const PiCamera = require('pi-camera');

export default function AddItem(props) {
  const [recipeSource, setRecipeSource] = useState([{}]);
  const [inputIngredientName, setInputIngredientName] = useState("");
  const [inputIngredientUnit, setInputIngredientUnit] = useState("mg");
  const [inputIngredientQuantity, setInputIngredientQuantity] = useState(1);
  const [ingred, setIngred] = useState([]);
  const [recipeData, setRecipeData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputIngredientName || !inputIngredientQuantity) return;
    projectFirestore.collection("inventory").add({
      produce: {
        name: inputIngredientName,
        unit: inputIngredientUnit,
        value: inputIngredientQuantity,
        image: "#",
      },
    });
    // setInputIngredientName("");
  };

  const handleInputIngredientNameChange = (e) => {
    setInputIngredientName(e.target.value);
  };

  const handleInputIngredientUnitChange = (e) => {
    setInputIngredientUnit(e.target.value);
  };

  const handleInputIngredientQuantityChange = (e) => {
    setInputIngredientQuantity(e.target.value);
  };

  const takeIngredientPhoto = (e) => {
    e.preventDefault();
    var dataToSend;

    var dt = new Date().toLocaleString();
    var fname = dt+".jpg";

    const myCamera = new PiCamera({
      mode: 'photo',
      output: `${ __dirname }/${fname}`,
      width: 1280,
      height: 720,
      nopreview: true,
    });

    myCamera.snap()
      .then((result) => {
        console.log(`<img src="${result}">`);
      })
      .catch((error) => {
        console.log("Error: Cant take photo.")
      })

    // setIngred((arr) => [...arr, inputIngredientName]);
  };

  const removeIngred = (e, ingredient) => {
    e.preventDefault();

    setIngred((arr) => arr.splice(arr.indexOf(ingredient), 1));
  };

  const ingredientCard = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "blueviolet",
    fontSize: "25px",
    color: "white",
    width: "fit-content",
    height: "60px",
    padding: "5px",
    margin: "5px",

    borderRadius: "15px",
  };

  const removeButton = {
    backgroundColor: "blueviolet",
    fontSize: "25px",
    boxShadow: "0px",
    border: "none",
    marginLeft: "10px",
  };

  return (
    <Grid item xs={12}>
      <div>
        <h1 className="sbi-header">Add an item</h1>
        <form>
          <label className="sbi-label">Enter ingredient name: </label>
          <input
            name="inputIngredientName"
            id="inputIngredientName"
            type="text"
            value={inputIngredientName}
            placeholder="Apples"
            onChange={handleInputIngredientNameChange}
            required
          />
          <br />
          <br />
          <label className="sbi-label">Select Unit: </label>
          <select
            name="inputIngredientUnit"
            id="inputIngredientUnit"
            onChange={handleInputIngredientUnitChange}
          >
            <option value="mg">mg</option>
            <option value="ml">ml</option>
            <option value="units">units</option>
          </select>
          <br />
          <br />
          <label className="sbi-label">Quantity: </label>
          <input
            type="number"
            id="inputIngredientQuantity"
            name="inputIngredientQuantity"
            value={inputIngredientQuantity}
            placeholder="1"
            onChange={handleInputIngredientQuantityChange}
            min="0"
            required
          />
          <br />
          <br />
          <button
            type="submit"
            onClick={takeIngredientPhoto}
            className="button-default"
          >
            Take Photo
          </button>
          <button onClick={handleSubmit} className="button-default">
            Add
          </button>
        </form>
        <div className="ingredients-div">
          <h2 className="sbi-header">Photo:</h2>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="white"
                        d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-12v-2h12v2z"
                      />
                    </svg>{" "}
                  </button>
                </div>
              );
            })}
        </div>
        <motion.div layout className="recipe-cards-div">
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
        </motion.div>
      </div>
    </Grid>
  );
}
