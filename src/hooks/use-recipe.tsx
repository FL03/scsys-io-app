/*
  Appellation: use-recipe <hooks>
  Contrib: @FL03
*/
import * as React from 'react';
import { getIngredientPrice } from '@/utils/mock/mockItemPrices';

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

interface Recipe {
  name: string;
  ingredients: Ingredient[];
  srvFactor: number;
}

export function useRecipe() {
  const [ingredients, setIngredients] = React.useState<Ingredient[]>([]);
  const [totalCost, setTotalCost] = React.useState(0);
  const [suggestedPrice, setSuggestedPrice] = React.useState(0);
  const [srvFactor, setSrvFactor] = React.useState(2);
  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  const [currentRecipe, setCurrentRecipe] = React.useState<string | null>(null);

  React.useEffect(() => {
    calculateTotalCost();
  }, [ingredients]);

  React.useEffect(() => {
    calculateSuggestedPrice();
  }, [totalCost, srvFactor]);

  const addIngredient = async (
    name: string,
    quantity: number,
    unit: string
  ) => {
    const price = await getIngredientPrice(name);
    setIngredients([...ingredients, { name, quantity, unit, price }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = async (
    index: number,
    updatedIngredient: Ingredient
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      ...updatedIngredient,
      price: await getIngredientPrice(updatedIngredient.name),
    };
    setIngredients(newIngredients);
  };

  const calculateTotalCost = () => {
    const cost = ingredients.reduce(
      (total, ing) => total + ing.price * ing.quantity,
      0
    );
    setTotalCost(cost);
  };

  const calculateSuggestedPrice = () => {
    setSuggestedPrice(totalCost * srvFactor);
  };

  const saveRecipe = (name: string) => {
    const newRecipe: Recipe = {
      name,
      ingredients,
      srvFactor,
    };
    setRecipes([...recipes, newRecipe]);
    setCurrentRecipe(name);
  };

  const loadRecipe = (name: string) => {
    const recipe = recipes.find((r) => r.name === name);
    if (recipe) {
      setIngredients(recipe.ingredients);
      setSrvFactor(recipe.srvFactor);
      setCurrentRecipe(name);
    }
  };

  return {
    ingredients,
    totalCost,
    suggestedPrice,
    addIngredient,
    removeIngredient,
    updateIngredient,
    srvFactor,
    setSrvFactor,
    saveRecipe,
    loadRecipe,
    recipes,
    currentRecipe,
  };
}
