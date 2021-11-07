import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import RecipeCard from "./RecipeCard";

import useFirestore from "../hooks/useFirestore";
import { projectFirestore } from '../firebase/config';

export default function Inventory(props) {
  const [ingred, setIngred] = useState([]);
  const [recipeData, setRecipeData] = useState(null);
  const [lastSynch, setLastSynch] = useState(null);
  const [totalValue, setTotalValue] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [onlineItem, setOnlineItem] = useState(false);

  //Pulls the documents in collection called 'inventory'
  const { docs } = useFirestore("inventory");

  useEffect(() => {
    setLastSynch(Date().toLocaleString());
    setIngred(
      docs.map((item) => {
        return item.produce.name;
      })
    );
  }, [docs]);

  async function getAvailableRecipes() {
    getRecipeByIng();
  }

  const handlePopupOpen = (itemname) => {
    setOnlineItem(itemname);
    setOpenPopup(true);
  };

  const handlePopupClose = () => {
    setOpenPopup(false);
  };

  const buyOnline = () => {
    window.open("https://www.amazon.in/s?k="+onlineItem, "_blank")
  };

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

  async function getInventoryValue() {
    let totalValue = 0
    docs.forEach((item) => {
      totalValue += item.produce.price;
    })

    setTotalValue(totalValue);
  }

  async function removeItem(e, item) {
    projectFirestore.collection("inventory").doc(item.id).delete().then(() => {
      console.log("Item successfully deleted!");
    }).catch((error) => {
      console.log("Error removing item: ", error);
    });
  }

  async function updateQuantity(e, increase, item) {
    let val = item.produce.value;
    if (increase) {
      val += 1;
    } else {
      val -= 1;
    }
    if (val < 0)
      val = 0;

    if (!item.produce.stockreminder && val == 0) {
      projectFirestore.collection("inventory").doc(item.id).delete().then(() => {
        console.log("Item successfully deleted!");
      }).catch((error) => {
        console.log("Error removing item: ", error);
      });
    } else {
      projectFirestore.collection("inventory").doc(item.id).update({
        produce: {
          name: item.produce.name,
          unit: item.produce.unit,
          value: val,
          image: item.produce.image,
          stockreminder: item.produce.stockreminder,
          price: item.produce.price,
        },
      });

      if (item.produce.stockreminder && val == 0) {
        // alert(item.produce.name + "Out of stock!");
        handlePopupOpen(item.produce.name);
      }
    }


  }

  async function setStockReminder(e, enable, item) {
    projectFirestore.collection("inventory").doc(item.id).update({
      produce: {
        name: item.produce.name,
        unit: item.produce.unit,
        value: item.produce.value,
        image: item.produce.image,
        stockreminder: enable,
        price: item.produce.price,
      },
    });
  }

  const inventoryList = {
    backgroundColor: "rgba(245,255,253,0.5)",
    overflowY: "scroll",
    minHeight: "420px",
    padding: "16px",
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
        Last Synced to{" "}
        <img
          src="https://firebase.google.com/downloads/brand-guidelines/PNG/logo-standard.png"
          width="71px"
          height="20px"
        ></img>{" "}
        : {lastSynch}
      </h2>
      <div style={{ boxShadow: "5px", border: "2px solid black" }}>
        <GridList cellHeight={380} cols={4} gap={20} style={inventoryList}>
          {docs.map((item) => (
            <GridListTile>
              <div className="invlist-div">
                <img
                  src={item.produce.image}
                  width="80%"
                  style={{ marginTop: "20px" }}
                />
                <div>
                  {" "}
                  <h2 className="invlist-label">{item.produce.name}</h2>{" "}
                  <b>
                    {"Rs"} {item.produce.price}
                  </b>{" "}
                  <br />
                  <b style={{ fontSize: "20px" }}>
                    {item.produce.value} {item.produce.unit}
                  </b>{" "}
                </div>
                <div>
                  <button className="button-info" onClick={(e) => updateQuantity(e, true, item)}>
                    ➕
                  </button>
                  <button className="button-info" onClick={(e) => updateQuantity(e, false, item)}>
                    ➖
                  </button>
                  <br/>
                  <button className="button-danger" onClick={(e) => removeItem(e, item)}>
                    Remove Item
                  </button>
                  {item.produce.stockreminder &&
                    <button className="button-default" onClick={(e) => setStockReminder(e, false, item)}>
                      🔕
                    </button>
                  }
                  {!item.produce.stockreminder &&
                    <button className="button-default" onClick={(e) => setStockReminder(e, true, item)}>
                      🔔
                    </button>
                  }

                </div>
              </div>
            </GridListTile>
          ))}
        </GridList>
      </div>
      <div>
        <button className="button-default" onClick={getAvailableRecipes}>
          View Available Recipes
        </button>
        <button className="button-default" onClick={getInventoryValue}>
          Get Inventory Value
        </button>
      </div>
      <div className="inventory-val-cards-div">
        {totalValue &&
          <h2><small>Total Value of inventory items is:</small> Rs {totalValue}</h2>
        }
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
      <Dialog
        open={openPopup}
        onClose={handlePopupClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {onlineItem + " Out of Stock!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You have run out of {onlineItem}. You can purchase more using the buy link below.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePopupClose}>Close</Button>
          <Button onClick={buyOnline} autoFocus>
            Buy on Amazon
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
