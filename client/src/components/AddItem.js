import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { projectFirestore } from "../firebase/config";

export default function AddItem(props) {
  const [inputIngredientName, setInputIngredientName] = useState("");
  const [inputIngredientUnit, setInputIngredientUnit] = useState("grams");
  const [inputIngredientQuantity, setInputIngredientQuantity] = useState(1);
  const [inputIngredientPrice, setInputIngredientPrice] = useState(1);
  const [inputIngredientImg, setInputIngredientImg] = useState("#");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputIngredientName || !inputIngredientQuantity || !inputIngredientPrice){
      alert("Please check input fields again, Invalid input.");
      return;
    }
    projectFirestore.collection("inventory").add({
      produce: {
        name: inputIngredientName,
        unit: inputIngredientUnit,
        value: inputIngredientQuantity,
        image: inputIngredientImg,
        price: inputIngredientPrice,
        stockreminder: false,
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

  const handleInputIngredientPriceChange = (e) => {
    setInputIngredientPrice(e.target.value);
  };

  const takeIngredientPhoto = (e) => {
    e.preventDefault();

    fetch("http://192.168.0.105:3253/", {
      mode: "cors",
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        setInputIngredientImg(data);
      });
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
            className="inputBox"
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
            className="inputBox"
            onChange={handleInputIngredientUnitChange}
          >
            <option value="grams">grams</option>
            <option value="ml">ml</option>
            <option value="units">units</option>
          </select>
          <br />
          <br />
          <label className="sbi-label">Quantity: </label>
          <input
            type="number"
            id="inputIngredientQuantity"
            className="inputBox"
            name="inputIngredientQuantity"
            value={inputIngredientQuantity}
            placeholder="1"
            onChange={handleInputIngredientQuantityChange}
            min="0"
            required
          />
          <br />
          <br />
          <label className="sbi-label">Price(in Rs): </label>
          <input
            type="number"
            id="inputIngredientPrice"
            className="inputBox"
            name="inputIngredientPrice"
            value={inputIngredientPrice}
            placeholder="1"
            onChange={handleInputIngredientPriceChange}
            min="0"
            step="0.5"
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

        <h2 className="sbi-header">Photo</h2>
        <img
          src={inputIngredientImg}
          alt="item photo"
          width="640"
          height="480"
        />
      </div>
    </Grid>
  );
}
