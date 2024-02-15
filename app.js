//import * as data from jsonDataURL;
const jsonDataURL = 'https://cables97.github.io/MealMaker/src/meals.json';

//-------------------------------------
//Fetch JSON Data from Github Page
//-------------------------------------
async function fun() {
    return fetch(jsonDataURL).then(res => res.json());
    }
    const data  = await fun();

console.log(data);





//----------------------------------
// DOM Variables
//----------------------------------
const domRecipeList = document.getElementById('recipe-list')
const domRecipeButton = document.getElementById('recipe-btn');


const domShoppingList = document.getElementById('shopping-list');
const domShoppingListButton = document.getElementById('s-l-btn');


//----------------------------------
// EventListeners Variables
//----------------------------------

//SideBar Buttons
domShoppingListButton.addEventListener('click', () => {
  toggleShoppingList();
})

domRecipeButton.addEventListener('click', () => {
  toggleRecipeList();
})

//Collapsable recipes
let coll = document.getElementsByClassName("recipe-item-top-bar");
for (let index = 0; index < coll.length; index++) {
  coll[index].addEventListener("click", function() {
    let nextSib  = this.nextElementSibling; 
    toggleRecipeCollapse(nextSib);
  });
} 

//Filter Item Buttons
let ingr = document.getElementsByClassName("filter-item");
for (let index = 0; index < ingr.length; index++) {
  ingr[index].addEventListener("click", function() {
    toggleFilterItems(this);
  });
} 


//----------------------------------
// Functions
//----------------------------------

function toggleShoppingList(){
    if (domShoppingList.classList.contains('s-l-open')){
      domShoppingList.classList.remove('s-l-open')
      domShoppingList.classList.add('s-l-close')

      domShoppingListButton.classList.add('rec-close')
      domShoppingListButton.classList.add('btn-rotate-close')

    }else{
      domShoppingList.classList.remove('s-l-close')
      domShoppingList.classList.add('s-l-open')

      domShoppingListButton.classList.add('btn-rotate-open')
      domShoppingListButton.classList.remove('btn-rotate-close')
    }
}

function toggleRecipeList(){
  domRecipeButton.offsetWidth;
  if (domRecipeList.classList.contains('rec-open')){
    domRecipeList.classList.remove('rec-open')
    domRecipeButton.classList.remove('btn-rotate-open')

    domRecipeList.classList.add('rec-close')
    domRecipeButton.classList.add('btn-rotate-close')

  }else{
    domRecipeList.classList.remove('rec-close')
    domRecipeList.classList.add('rec-open')
    
    domRecipeButton.classList.add('btn-rotate-open')
    domRecipeButton.classList.remove('btn-rotate-close')

  }
}




function toggleRecipeCollapse(collapse){
  collapse.classList.toggle("active");
  if (collapse.style.display === "block") {
    collapse.style.display = "none";
  } else {
    collapse.style.display = "block";
  }
}

function toggleFilterItems(el){
  if (el.classList.contains('f-i-include')) {
      el.classList.remove('f-i-include');
      el.classList.add('f-i-exclude');
      } else if (el.classList.contains('f-i-exclude')){
        el.classList.remove('f-i-exclude');
      } else{
        el.classList.add('f-i-include');
      }
}


function buildRecipes(recipe){

  let recipeName = recipe.name;
  let recipeCalories = recipe.calories
  let recipeCookTime = recipe.cookTime;
  let recipeIngredientList = recipe.ingredients;
  let recipeDirections = recipe.directions;

 //Recipe Box
  let recipeMaster = document.createElement("div");
  recipeMaster.classList.add('recipe-item');
  domRecipeContainer.append(recipeMaster);
    //Visible Recipe Bar
    let recipeItemTopBar = document.createElement('div');
    recipeItemTopBar.classList.add('recipe-item-top-bar');
    recipeMaster.append(recipeItemTopBar);
      //Recipe Name
      let recipeItemName = document.createElement('p');
      recipeItemName.innerHTML = recipeName;
      recipeItemTopBar.append(recipeItemName);
      //Recipe Calories
      let recipeItemCalories = document.createElement('p');
      recipeItemCalories.innerHTML = recipeCalories;
      recipeItemTopBar.append(recipeItemCalories);

    //Recipe Contents
    let recipeItemContents = document.createElement('div');
    recipeItemContents.classList.add('recipe-item-contents');
    recipeMaster.append(recipeItemContents);

    //FOR EACH RECIPE ITEM

    let ingredientName = "";

    let recipeIngredient = document.createElement('div');
    recipeIngredient.classList.add('recipe-ingredient');
    recipeItemContents.append(recipeIngredient);


      




}

/*
  Legend:
  Un = unit

  Lb = pounds
  Oz = Ounces
  Of = Ounces(fluid)
  Cn = cans
  Cu = Cups
  Ts = Teaspoon
  Tb = Tablespoon
  Pi = pinch

  Kg = Kilogram
  Gr = gram
  Mg = Milligram

  Ml=Milliliter
  Li = Liter

  slice last 2 letters off string to give Unit. Slice at (-) for space. 
*/