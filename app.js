
//-------------------------------------
//Fetch JSON Data from Github Page
//-------------------------------------
//import * as data from jsonDataURL;
//const jsonDataURL = "https://cables97.github.io/MealMaker/src/meals.json";
const jsonDataURL = './src/meals.json'
async function fun() {
  return fetch(jsonDataURL).then(res => res.json());
  }
const data  = await fun();

console.log(data);

//----------------------------------
// DOM Variables
//----------------------------------
const domRecipeList = document.getElementById('recipe-list')
const domRecipeButton = document.getElementById('recipe-open-btn');
const domRecipeContainer = document.getElementById('recipe-container');


const domShoppingList = document.getElementById('shopping-list');
const domShoppingListButton = document.getElementById('s-l-open-btn');


buildRecipeList(data[0]);
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

//drag n drop Events
let dragDrop = document.getElementsByClassName('drag-drop');
for (let index = 0; index < dragDrop.length; index++) {
  console.log(dragDrop[index]);
  dragDrop[index].addEventListener("drop", (event) => {
    drop(event);
  });
  dragDrop[index].addEventListener('dragover', (event)=>{
    allowDrop(event);
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


function buildRecipeList(recipe){

  let recipeName = recipe.name;
  let recipeCalories = recipe.calories + " cal";
  let recipeCookDur = recipe.cookTime;
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
    recipeItemContents.classList.add('recipe-item-content');
    recipeMaster.append(recipeItemContents);

    let recipeInfo = document.createElement('div');
    recipeInfo.classList.add('recipe-info');
    recipeItemContents.append(recipeInfo);

      let recipeTimeTrack = document.createElement('div');
      recipeTimeTrack.classList.add('time-track');
      recipeInfo.append(recipeTimeTrack);
        
        let recipeTimeClock = document.createElement('i');
        recipeTimeClock.classList.add('fa-solid');
        recipeTimeClock.classList.add('fa-clock');
        recipeTimeClock.classList.add('fa-lg');
        recipeTimeTrack.append(recipeTimeClock);

        let recipeCookTime= document.createElement('p');
        recipeCookTime.innerHTML = recipeCookDur;
        recipeTimeTrack.append(recipeCookTime);

      let recipeLink = document.createElement('a');
      recipeLink.href = recipe.link;
      recipeLink.innerHTML = 'Recipe';
      recipeLink.target = "_blank"
      recipeInfo.append(recipeLink);

      let recipeLinkImg = document.createElement('i');
      recipeLinkImg.classList.add('fa-solid');
      recipeLinkImg.classList.add('fa-link');
      recipeLink.append(recipeLinkImg);


      console.log(data[0].ingredients[0][0].split(/-/).join(" "));
      console.log(data[0].ingredients[0][1][0] + " " + data[0].ingredients[0][1][1]);

    //FOR EACH RECIPE ITEM
    recipeIngredientList.forEach(ingr => {
      let qnty;
      if(ingr[1][1] === "unit"){
         qnty = ingr[1][0];
      } else{
         qnty = ingr[1][0] + " " + ingr[1][1];
      }

        let recipeIngredient = document.createElement('div');
        recipeIngredient.classList.add('recipe-ingredient');
        recipeItemContents.append(recipeIngredient);

            let recipeIngredientName = document.createElement('p');
            recipeIngredientName.innerHTML = ingr[0].split(/-/).join(" ");
            recipeIngredient.append(recipeIngredientName);

            let recipeIngredientAmnt = document.createElement('p');
            recipeIngredientAmnt.innerHTML = qnty;
            recipeIngredient.append(recipeIngredientAmnt);
    });






      




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

function allowDrop(even) {
  even.preventDefault();
}

function drag(even) {
  even.dataTransfer.setData("text", even.target.id);
}

function drop(even) {
  even.preventDefault();
  var fetchData = even.dataTransfer.getData("application/x-moz-node");
  even.target.appendChild(document.getElementById(fetchData));
}

//for each day, assign 

