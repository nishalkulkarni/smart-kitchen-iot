import React from "react";
import Meal from "./Meal";

export default function MealList({ mealData }) {
  const nutrients = mealData.nutrients;

  return (
    <main>
      <section className="nutrients">
        <ul>
          <li><b>Calories</b> {nutrients.calories.toFixed(0)}</li>
          <li><b>Carbohydrates</b> {nutrients.carbohydrates.toFixed(0)}</li>
          <li><b>Fat</b> {nutrients.fat.toFixed(0)}</li>
          <li><b>Protein</b> {nutrients.protein.toFixed(0)}</li>
        </ul>
      </section>

      <section className="meals">
        {mealData.meals.map((meal) => {
          return <Meal key={meal.id} meal={meal} />;
        })}
      </section>
    </main>
  );
}
