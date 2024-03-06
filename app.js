// ESM:
//import convert from "convert";

//-------------------------------------
//Fetch JSON Data from Github Page
//-------------------------------------
//import * as data from jsonDataURL;
//const jsonDataURL = "https://cables97.github.io/MealMaker/src/meals.json";
const jsonDataURL = './src/meals.json'
async function fun() {
  return fetch(jsonDataURL).then(res => res.json());
  }
const recipeBook  = await fun();

console.log(recipeBook);

//----------------------------------
// DOM Variables
//----------------------------------
const domRecipeList = document.getElementById('recipe-list')
const domRecipeButton = document.getElementById('recipe-open-btn');
const domRecipeContainer = document.getElementById('recipe-container');


const domShoppingList = document.getElementById('shopping-list');
const domShoppingListButton = document.getElementById('s-l-open-btn');


const domAddRecipe = document.getElementById('add-recipe');

const domModal = document.getElementById('modal');
const domModalClose = document.getElementById('modal-close');
const domModalOpen = document.getElementById('add-recipe');
const domRecipeAddIngr = document.getElementById('recipe-add-ingr');

const domAddNewRecipe = document.getElementById('add-recipe-btn');

//----------------------------------
// Global Variables
//----------------------------------

let shoppingList = [
  { 'name' : 'onion',
    'qnty' : '3',
    'unit' : 'lbs'},
];


buildRecipeList(recipeBook[0]);
buildRecipeList(recipeBook[1]);


//----------------------------------
// EventListeners
//----------------------------------

//SideBar Buttons
domShoppingListButton.addEventListener('click', () => {
  toggleShoppingList();
})

domRecipeButton.addEventListener('click', () => {
  toggleRecipeList();
})



//Filter Item Buttons
let ingr = document.getElementsByClassName("filter-item");
for (let index = 0; index < ingr.length; index++) {
  ingr[index].addEventListener("click", function() {
    toggleFilterItems(this);
  });
} 

//drag n drop container elements
let dragDrop = document.getElementsByClassName('drag-drop');
for (let index = 0; index < dragDrop.length; index++) {
  dragDrop[index].addEventListener("drop", (event) => {
    console.log('drop');
    drop(event);
  });

  dragDrop[index].addEventListener('dragover', (event)=>{
    allowDrop(event);
  });
} 

//draggable Elements
/*let grabObjs = document.getElementsByClassName('draggable');
for (let index = 0; index < grabObjs.length; index++) {
  grabObjs[index].addEventListener("dragstart", (event) => {
    console.log('drag');
    drag(event)
  });
} */

domRecipeAddIngr.addEventListener('click', addRecipeIngr);

document.getElementById('recipe-add-step').addEventListener('click', () =>{
  addRecipeStep();
})

domAddNewRecipe.addEventListener('click', addRecipe);


//modal Open
domModalClose.addEventListener('click', toggleModal);
domModalOpen.addEventListener('click', toggleModal);

//----------------------------------
// Toggle Functions
//----------------------------------

//Opens Shopping List
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

//Opens Recipe List
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

//Collapsable recipe info
function toggleRecipeCollapse(collapse){
  collapse.classList.toggle("active");
  if (collapse.style.display === "block") {
    collapse.style.display = "none";
  } else {
    collapse.style.display = "block";
  }
}

//Collapsable recipe info
function toggleModal(){
  if (domModal.style.display === "block") {
    domModal.style.display = "none";
  } else {
    domModal.style.display = "block";
  }
}



//change filter items from Include => Exclude => None
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
*/

//----------------------------------
// Drag n Drop Functions
//----------------------------------

let grabbedObj;

function allowDrop(even) {
  even.preventDefault();
}

function drag(even) {
  even.dataTransfer.setData("text", even.target.id);
  console.log('id= ' + even.target.id);
  grabbedObj = even.target.id;
}

function drop(event) {
  if(event.target.classList.contains('drag-drop')){
    let newRecipe = recipeBook.find(o => o.id === grabbedObj);
    console.log(newRecipe);
    buildCalenderItem(event.target, newRecipe);
  } else {
    console.log("Can't drop item here")
  }


}

//----------------------------------
// Element Building Functions
//----------------------------------

//Creates each Recipe Item based on each JSON Object
function buildRecipeList(recipe){

  let recipeName = recipe.name;
  let recipeCalories = recipe.calories + " cal";
  let recipeCookDur = recipe.cookTime;
  let recipeIngredientList = recipe.ingredients;
  let recipeId= recipe.id;

 
 //Recipe Box
  let recipeMaster = document.createElement("div");
  recipeMaster.classList.add('recipe-item');
  recipeMaster.draggable = 'true';
  recipeMaster.classList.add('draggable');
  recipeMaster.id = recipeId;
    recipeMaster.addEventListener("dragstart", (event) => {
      console.log('drag');
      drag(event)
    });
  domRecipeContainer.append(recipeMaster);


    //Visible Recipe Bar
    let recipeItemTopBar = document.createElement('div');
    recipeItemTopBar.classList.add('recipe-item-top-bar');

    recipeItemTopBar.addEventListener('click', ()=>{
      let nextSib  = recipeItemTopBar.nextElementSibling; 
      toggleRecipeCollapse(nextSib);
    })


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


      console.log(recipeBook[0].ingredients[0][0].split(/-/).join(" "));
      console.log(recipeBook[0].ingredients[0][1][0] + " " + recipeBook[0].ingredients[0][1][1]);

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

function buildCalenderItem(parent, recipe){
  let recipeName = recipe.name;
  let recipeCalories = recipe.calories + " cal";
  let recipeCookDur = recipe.cookTime;
  let recipeIngredientList = recipe.ingredients;
  let recipeDirections = recipe.directions;
  let recipeLink = recipe.link;


 
 //Calender Item Recipe Box
  let divCalenderItem = document.createElement("div");
  divCalenderItem.classList.add('calender-item');
  divCalenderItem.classList.add('draggable');
  divCalenderItem.draggable = 'true';
  parent.append(divCalenderItem);

    let divTitleWrapper = document.createElement('div');
    divTitleWrapper.classList.add('title-wrapper');
    divCalenderItem.append(divTitleWrapper);
      

      //Item name
      let pItemName = document.createElement('p');
      pItemName.innerHTML = recipeName;
      divTitleWrapper.append(pItemName);

      //close
      let divCloseBtn = document.createElement('div');
      divCloseBtn.classList.add('close-btn');
      divCloseBtn.addEventListener('click', () =>{
        divCloseBtn.parentElement.parentElement.remove()
      })
      divTitleWrapper.append(divCloseBtn);



        let iCloseBtn = document.createElement('i');
        iCloseBtn.classList.add('fa-regular');
        iCloseBtn.classList.add('fa-circle-xmark');
        iCloseBtn.classList.add('fa-lg');
        divCloseBtn.append(iCloseBtn);
      




  //ToolTip
  let divToolTip = document.createElement('div');
  divToolTip.classList.add('tool-tip');
  divCalenderItem.append(divToolTip);
    //recipe Info
    let divRecipeInfo = document.createElement('div');
    divRecipeInfo.classList.add('recipe-info');
    divToolTip.append(divRecipeInfo);
      //time
      let divTimeTrack = document.createElement('div');
      divTimeTrack.classList.add('time-track');
      divRecipeInfo.append(divTimeTrack);
        //clock
        let iClock = document.createElement('i');
        iClock.classList.add('fa-solid');
        iClock.classList.add('fa-clock');
        iClock.classList.add('fa-md');
        divTimeTrack.append(iClock);
        //cookTime
        let pTimer = document.createElement('p')
        pTimer.innerHTML = recipeCookDur;
        divTimeTrack.append(pTimer);

      //calories
      let pCalories = document.createElement('p');
      pCalories.innerHTML = recipeCalories;
      divRecipeInfo.append(pCalories);

      //link
      let aLink = document.createElement('a');
      aLink.href = recipeLink;
      aLink.innerHTML = 'Recipe';
      aLink.target = "_blank"
      divRecipeInfo.append(aLink);

        //link img
        let iLink = document.createElement('i');
        iLink.classList.add('fa-solid');
        iLink.classList.add('fa-link');
        iLink.classList.add('fa-md');
        aLink.append(iLink);

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
        divToolTip.append(recipeIngredient);

            let recipeIngredientName = document.createElement('p');
            recipeIngredientName.innerHTML = ingr[0].split(/-/).join(" ");
            recipeIngredient.append(recipeIngredientName);

            let recipeIngredientAmnt = document.createElement('p');
            recipeIngredientAmnt.innerHTML = qnty;
            recipeIngredient.append(recipeIngredientAmnt);
    });


}

//creates ShoppingListItem
function buildShoppingListItem(name, amount, unit){
  //when item is dropped on calc. Adds the ingr. 
  let domShoppingList = document.getElementById('shopping-list-container')

  let divListItem = document.createElement('div')
  divListItem.classList.add('list-item');
  domShoppingList.append(divListItem);

    let divItemName = document.createElement('div');
    divItemName.classList.add('item-name');
    divListItem.append(divItemName);

      let pItemName = document.createElement('p');
      pItemName.innerHTML = name.split(/-/).join(" ");
      divItemName.append(pItemName);

      //Metric
    let divItemQnty = document.createElement('div');
    divItemQnty.classList.add('item-qnty');
    divListItem.append(divItemQnty);

      let pItemQnty = document.createElement('p');
      pItemQnty.innerHTML = amount;
      divItemQnty.append(pItemQnty);

      let pItemUnit = document.createElement('p');
      pItemUnit.innerHTML = unit;
      divItemQnty.append(pItemUnit);

      //Imperial
      let divItemQntyImp = document.createElement('div');
      divItemQntyImp.classList.add('item-qnty');
      divListItem.append(divItemQntyImp);
  
        let pItemQntyImp = document.createElement('p');
        //let pItemQntyImpConvert = convert(amount, unit).to('')
        pItemQntyImp.innerHTML = amount;
        divItemQntyImp.append(pItemQntyImp);
  
        let pItemUnitImp = document.createElement('p');
        pItemUnitImp.innerHTML = unit;
        divItemQntyImp.append(pItemUnitImp);
  
}



let ingredients = ["manwich-sauce", [0.5, "can"]];

addIngredientToShoppingList(ingredients);
addIngredientToShoppingList(ingredients);

//Adds ingredient into shopping list, input format = ["ingredient", [quantity, Unit of measure]]
function addIngredientToShoppingList(arrIngr){
  //When item is added, it goes through this first
  //Checks if ingr is in IngredientList. If the item is on the list, add the amount in recipe to the list item.
  //if item is in list: add value to qnty;
  //if item is not in list. Adds item to list, and put item through the buildShoppingListItem;

  let ingrName = arrIngr[0];
  let ingrQnty = arrIngr[1][0];
  let ingrUnit = arrIngr[1][1];
  let ingrBool ;

  //Search the ingredient List for ingredient. If on it, sets the bool to true.
  shoppingList.forEach(element => {
  if(element.hasOwnProperty(ingrName)){
    ingrBool = true;
  }
});

//if ingr in list, then finds it, and adds the Qnty together. 
  if(ingrBool){
    //Adds the ingredient together
    console.log('ingredient already on list');

    //in ingr not on list, adds it
  }else{
    let newIngredient = {};

    newIngredient[ingrName] = ingrQnty;
    newIngredient['unit'] = ingrUnit;
    shoppingList.push(newIngredient);
    console.log('Ingredient Added');

    buildShoppingListItem(ingrName, ingrQnty, ingrUnit);
  }

  console.log(shoppingList);
}

//removes all ingredients from a recipe. also adds 
function removeIngredientFromList(arrIngr){

  let ingrName = arrIngr[0];
  let ingrQnty = arrIngr[1][0];
  let ingrUnit = arrIngr[1][1];
  let ingrArrIndex ;

  /*
  let ingredientList = [
    { 'name' : 'onion',
      'qnty' : '3',
      'unit' : 'lbs'  },

    { 'name' : 'pepper',
      'qnty' : '3',
      'unit' : 'lbs'  },
  ];

  let ingredients = ["manwich-sauce", [0.5, "can"]];
*/


  //find ingredient index in list by name. 


  //slice that ingredient as new var


  //remove the amount in qnty that is in the recipe. 


  //push ingredient back into array //if there is 0 or less of the ingredient remaining, don't re-add


}


//----------------------------------
// Functional Functions
//----------------------------------

function addRecipe(){

  //takes all the inputted information that is in modal form
  //parses it into Obj format, then pushes to the Recipe book
let newRecipe = {};

let modalName = document.getElementById('m-recipe-name');
let modalCalories = document.getElementById('m-recipe-calories');
let modalCooktime = document.getElementById('m-recipe-cook-time');

let modalIngredientBox = document.getElementById('recipe-ingredient-box-list');
let modalDirectionBox = document.getElementById('recipe-directions-box-list');

//RecipeId
newRecipe['id'] = modalName.value.replace(/\s+/g, '-').toLowerCase();

newRecipe['name'] =  modalName.value.toLowerCase();

newRecipe['calories'] = modalCalories.value;

newRecipe['cookTime'] = modalCooktime.value;

newRecipe['ingredients'] = []
//find all instances of <li class="m-recipe-ingredient"> in <ul id="recipe-ingredient-box-list">
//[ingr-name, [ingr-qnty, ele.options[e.selectedIndex].value]]
let objArrRecipeIngr = modalIngredientBox.getElementsByClassName('m-recipe-ingredient');
let arrRecipeIngr = Array.from(objArrRecipeIngr);
//console.log(arrRecipeIngr);

arrRecipeIngr.forEach(element => {

  let newIngredient = [];
  newIngredient.push(element.getElementsByClassName('ingr-name')[0].value);

  let newIngredientQnty = []
  newIngredientQnty.push(element.getElementsByClassName('ingr-qnty')[0].value);
  newIngredientQnty.push(element.getElementsByClassName('ingr-unit')[0].value);

  //put together all the values into one array
  newIngredient.push(newIngredientQnty);
  newRecipe['ingredients'].push(newIngredient)

});

newRecipe['link'] = document.getElementById('m-recipe-link').value;
console.log(newRecipe);
//Adds the new recipe into the Recipe Book
recipeBook.push(newRecipe);
console.log(recipeBook[0]);
console.log(newRecipe);
buildRecipeList(newRecipe);

console.log(recipeBook);
clearAddRecipe();
}



//Clears the AddRecipe Modal, empties all boxes, deletes all, but one ingr/dir
function clearAddRecipe(){
  let modalName = document.getElementById('m-recipe-name');
let modalCalories = document.getElementById('m-recipe-calories');
let modalCooktime = document.getElementById('m-recipe-cook-time');

let modalIngredientBox = document.getElementById('recipe-ingredient-box-list');
let modalDirectionBox = document.getElementById('recipe-directions-box-list');

  modalName.value = ''
  modalCalories.value = '';
  modalCooktime.value = '';
//finds number of instruction elements. removes all but first
  removeChildren(modalIngredientBox);
  removeChildren(modalDirectionBox);

  modalIngredientBox.getElementsByClassName('ingr-name')[0].value = '';
  modalIngredientBox.getElementsByClassName('ingr-qnty')[0].value = '';
  modalIngredientBox.getElementsByClassName('ingr-unit')[0].value = 'unit';
}



//Removes all but the first child of the parentElement
function removeChildren(parentElement){
  //finds length of parentelement
  let length = parentElement.children.length;
  //while length is > 1 --keep first child, delete rest
  while( length > 1){
    parentElement.removeChild(parentElement.lastElementChild);
    length--
  }
}




let arrUnits = ['units', 'lbs', 'oz', 'fl.oz','cans','cups','ts', 'tbs', 'kg', 'g', 'mg', 'mL', 'L' ]

//Modal - Adds space for ingredient input in AddRecipe Modal
function addRecipeIngr(){
  let ul = document.getElementById('recipe-ingredient-box-list');


  let liIngredient = document.createElement('li');
  liIngredient.classList.add('m-recipe-ingredient')
  ul.append(liIngredient);

  let ingrName = document.createElement('input')
  ingrName.classList.add('ingr-name');
  ingrName.classList.add('text-input');
  ingrName.setAttribute('type', 'text');
  ingrName.setAttribute('placeholder', 'Ingredient Name...')
  liIngredient.append(ingrName);

  let ingrQnty = document.createElement('input')
  ingrQnty.classList.add('ingr-qnty');
  ingrQnty.classList.add('text-input');
  ingrQnty.setAttribute('type', 'text');
  ingrQnty.setAttribute('placeholder', '0.0')
  liIngredient.append(ingrQnty);

  let ingrUnitDropdown = document.createElement('select');
  ingrUnitDropdown.classList.add('ingr-unit');
  ingrUnitDropdown.classList.add('text-input');
  liIngredient.append(ingrUnitDropdown);

  arrUnits.forEach(element => {
    let dropOptions = document.createElement('option');
    dropOptions.value = element;
    dropOptions.innerHTML = element;
    ingrUnitDropdown.append(dropOptions);
  });

  let divCloseBtn = document.createElement('div');
  divCloseBtn.classList.add('close-btn');
  divCloseBtn.addEventListener('click', ()=>{
    divCloseBtn.parentElement.remove()
  })
  liIngredient.append(divCloseBtn);

    let iCloseBtn = document.createElement('i');
    iCloseBtn.classList.add('fa-regular');
    iCloseBtn.classList.add('fa-circle-xmark');
    divCloseBtn.append(iCloseBtn);
}
//Modal - Adds space for directions input in AddRecipe Modal
function addRecipeStep(){
  let ul = document.getElementById('recipe-directions-box-list');
  let arrSteps = ul.getElementsByClassName('step');
  let stepNum = arrSteps.length + 1;

  
  let liStep= document.createElement('li');
  liStep.classList.add('step');
  ul.append(liStep);

  let pStep = document.createElement('p');
  pStep.innerHTML = 'Step ' + stepNum + ':';
  liStep.append(pStep);

  let inputStep = document.createElement('input')
  inputStep.classList.add('ingr-qnty');
  inputStep.classList.add('text-input');
  inputStep.setAttribute('type', 'text');
  liStep.append(inputStep);

  let divCloseBtn = document.createElement('div');
  divCloseBtn.classList.add('close-btn');
  divCloseBtn.addEventListener('click', ()=>{
    divCloseBtn.parentElement.remove()
  })
  liStep.append(divCloseBtn);

    let iCloseBtn = document.createElement('i');
    iCloseBtn.classList.add('fa-regular');
    iCloseBtn.classList.add('fa-circle-xmark');
    divCloseBtn.append(iCloseBtn);

  


  //find the last step number,

  //increase by one, use as name

}

