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

//page buttons

const domRecipeButton = document.getElementById('recipe-tab');
const domShoppingListButton = document.getElementById('shopping-tab');
const domSettingsButton = document.getElementById('settings-tab')

const domRecipeList = document.getElementById('recipe-list')

const domRecipeContainer = document.getElementById('recipe-container');

const domShoppingListCont = document.getElementById('shopping-list-container')
const domShoppingList = document.getElementById('shopping-list');



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

let arrUnits = ['lbs', 'oz', 'fl.oz','cups','ts', 'tbs', 'kg', 'g', 'mg', 'mL', 'L' ]

let calorieGoal = 1500; 

buildRecipeList(recipeBook[0]);
buildRecipeList(recipeBook[1]);


//----------------------------------
// EventListeners
//----------------------------------

//mouse tracking
let mouseX;
let mouseY;
window.addEventListener('click', (event) => {
  mouseX =  event.clientX;
  mouseY = event.clientY;
});


//SideBar Buttons
domShoppingListButton.addEventListener('click', () => {
  togglePage('shopping');
})
domRecipeButton.addEventListener('click', () => {
  togglePage('recipe');
})
domSettingsButton.addEventListener('click', ()=>{
  togglePage('settings');
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
//Swaps between pages on side menu
function togglePage(target){
  let domTopPage = document.getElementById('side-menu').getElementsByClassName('top')[0];
  let domMidPage = document.getElementById('side-menu').getElementsByClassName('mid')[0];
  let domTarget = document.getElementById(target);
  //disable buttons **Was running into problems where clicking between tabs too fast would mess with the... 

  if(!domTarget.classList.contains('top')){

    //class changing. Disabling the pointer events at the start of the function is an easy workaround.
    domRecipeButton.style.pointerEvents = "none";
    domSettingsButton.style.pointerEvents = "none";
    domShoppingListButton.style.pointerEvents = "none";
    console.log('clicked page: ' + target);
    domTarget.preventDefault;
    let domRecipePage = document.getElementById('recipe');
    let domListPage = document.getElementById('shopping');
    let domSettings = document.getElementById('settings');
    console.log(domTopPage);
    //clicking on target removes page-shift from all tabs
    domRecipePage.classList.remove('page-shift');
    domListPage.classList.remove('page-shift');
    domSettings.classList.remove('page-shift');
    domTarget.offsetWidth;
    domTarget.classList.add('page-shift');
    
  //wait until page is hidden, then change the top/mid/bot classes between top/target

  setTimeout(() => {
    if(domTarget.classList.contains('bot')){
      console.log('swapped bot')
      domTarget.classList.remove('bot');
      domTarget.classList.add('top');

      domTopPage.classList.remove('top');
      domTopPage.classList.add('mid');

      domMidPage.classList.remove('mid');
      domMidPage.classList.add('bot')

    } else if(domTarget.classList.contains('mid')){
      console.log('swapped Mid')
      domTarget.classList.remove('mid');
      domTarget.classList.add('top');

      domTopPage.classList.remove('top')
      domTopPage.classList.add('mid');
    } else {
      console.log('error- check classes');
    }
    //enable buttons again
    domRecipeButton.style.pointerEvents = "all";
    domSettingsButton.style.pointerEvents = "all";
    domShoppingListButton.style.pointerEvents = "all";
  }, 500);
    }else{
      console.log('clicked top page')
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


function throwErrorWindow(errorString){
  //Takes input val, pushes it to error box, then has error box play show animation
  let errorWindow = document.getElementById('error-window');
  let errorWindowText = errorWindow.getElementsByClassName('text')[0];
  errorWindowText.innerHTML = errorString;
  errorWindow.addEventListener('click', ()=>{
    errorWindow.style.opacity = '0';
    errorWindow.classList.remove('error-window-pop');
  })

  errorWindow.classList.remove('error-window-pop');
  errorWindow.offsetWidth;
  errorWindow.classList.add('error-window-pop');
  errorWindow.preventDefault;
}

function throwErrorCursor(errorString){
  //small pop up offset from cursor, 1em diag. Fades after 10sec.
  let errorWindow = document.getElementById('cursor-error');
  let errorWindowText = errorWindow.getElementsByClassName('text')[0];

  console.log(mouseY + 'px');
  console.log(mouseX+ 'px');
  errorWindow.style.setProperty("top", mouseY - 100 + 'px');
  errorWindow.style['left']  = mouseX + 'px';

  errorWindowText.innerHTML = errorString;
  errorWindow.addEventListener('click', ()=>{
    errorWindow.style.opacity = '0';
    errorWindow.classList.remove('error-window-pop');
  })

  errorWindow.classList.remove('error-window-pop');
  errorWindow.offsetWidth;
  errorWindow.classList.add('error-window-pop');
  errorWindow.preventDefault;

}



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
    if(event.target.getElementsByClassName('calendar-item').length < 3){
      let newRecipe = recipeBook.find(o => o.id === grabbedObj);
      console.log(newRecipe);
      buildCalenderItem(event.target, newRecipe);
      recipeDropToShoppingList(newRecipe);
      updateDailyCalories(event.target);
    } else {
      console.log("Only 3 recipes allowed");
    }
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
  divCalenderItem.classList.add('calendar-item');
  divCalenderItem.classList.add('draggable');
  divCalenderItem.draggable = 'true';
  parent.append(divCalenderItem);

    let divTitleWrapper = document.createElement('div');
    divTitleWrapper.classList.add('title-wrapper');
    divCalenderItem.append(divTitleWrapper);
      

      //Item name
      let pItemName = document.createElement('p');
      pItemName.innerHTML = recipeName;
      pItemName.classList.add('recipe-name')
      divTitleWrapper.append(pItemName);

      //close
      let divCloseBtn = document.createElement('div');
      divCloseBtn.classList.add('close-btn');
      divCloseBtn.addEventListener('click', () =>{
        
        divCloseBtn.parentElement.parentElement.remove()
        updateDailyCalories(parent)
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

function recipeDropToShoppingList(recipeIn){
  recipeIn['ingredients'].forEach(element => {
    addIngredientToShoppingList(element)
  });
}

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
    if(element["name"] == (ingrName)){
      ingrBool = true;
      console.log(ingrName +' checked')
    }
});

//if ingr in list, then finds it, and adds the Qnty together. 
  if(ingrBool){//Adds the ingredient together
    console.log(ingrName + ' already on list');

    let index = shoppingList.findIndex(x => x["name"] == ingrName)
    let listItem = shoppingList[index];

    if(ingrUnit === listItem['unit']){
      listItem['qnty'] = listItem['qnty'] + ingrQnty;
      console.log(listItem["qnty"]);
      updateShoppingList()
    }
    else{
      console.log('differentUnits')
    }
  }else{//if ingr not on list, adds it
    let newIngredient = {};

    newIngredient['name'] = ingrName;
    newIngredient['qnty'] = ingrQnty;
    newIngredient['unit'] = ingrUnit;
    shoppingList.push(newIngredient);
    console.log('Ingredient Added');

    updateShoppingList()
  }
  console.log(shoppingList);
}

//removes all ingredient from a recipe 
function removeIngredientFromShoppingList(arrIngr){

  //format: ["ingredient", [quantity, Unit of measure]]

  let ingrName = arrIngr[0];
  let ingrQnty = arrIngr[1][0];
  let ingrUnit = arrIngr[1][1];
  let ingrArrIndex ;


  //find ingredient index in list by name. 


  //slice that ingredient as new var


  //remove the amount in qnty that is in the recipe. 


  //push ingredient back into array 
  
  //if there is 0 or less of the ingredient remaining, don't re-add


}


//clears shoppinglistcontaier, rebuilds all list items from shopping list
function updateShoppingList(){
  //delete all children
  while (domShoppingListCont.firstChild) {
    domShoppingListCont.removeChild(domShoppingListCont.firstChild);
  }
  //For each shopping List item, build shoppingList Item
  shoppingList.forEach(element => {
    buildShoppingListItem(element["name"], element['qnty'], element["unit"])
  });

}

//creates ShoppingListItem in DOM
function buildShoppingListItem(name, amount, unit){
  //when item is dropped on calc. Adds the ingr. 
  

  let divListItem = document.createElement('div')
  divListItem.classList.add('list-item');
  domShoppingListCont.append(divListItem);

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




//----------------------------------
// Modal Functions
//----------------------------------

//Takes Modal info, parses it as OBJ then pushes it to the RecipeBook
function addRecipe(){

let newRecipe = {};
let modalName = document.getElementById('m-recipe-name');
let modalCalories = document.getElementById('m-recipe-calories');
let modalCooktime = document.getElementById('m-recipe-cook-time');
let modalIngredientBox = document.getElementById('recipe-ingredient-box-list');
let modalDirectionBox = document.getElementById('recipe-directions-box-list');

//Validate info first, if any is wrong, prevent it from submitting
let validateName = validateInput(modalName.value, 'string', modalName);
let validateCal = validateInput(modalCalories.value, 'int', modalCalories);
let validateCookTime = validateInput(modalCooktime.value, 'int', modalCooktime);
console.log(validateCal);
console.log(validateCookTime);
console.log(validateName);
//validate all of the boxes, if any are wrong, don't do anything. 

if(validateName == false || validateCal == false || validateCookTime == false ){
  console.log('fail');
  throwErrorWindow('There seems to be an issue with the values entered');
} 

else{
  //RecipeId
  newRecipe['id'] = modalName.value.replace(/\s+/g, '-').toLowerCase();
  newRecipe['name'] =  modalName.value.toLowerCase();
  newRecipe['calories'] = parseInt(modalCalories.value);
  newRecipe['cookTime'] = modalCooktime.value + ' min';

  newRecipe['ingredients'] = []
  //find all instances of <li class="m-recipe-ingredient"> in <ul id="recipe-ingredient-box-list">
  //[ingr-name, [ingr-qnty, ele.options[e.selectedIndex].value]]
  let objArrRecipeIngr = modalIngredientBox.getElementsByClassName('m-recipe-ingredient');
  let arrRecipeIngr = Array.from(objArrRecipeIngr);
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
  //builds Recipe List Element
  buildRecipeList(newRecipe);
  //console log RecipeBook
  console.log(recipeBook);
  //Clear all input elements from Modal
  clearAddRecipe();
}


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

//Removes all but the first child of the parentElement - used in Modal Resetting
function removeChildren(parentElement){
  //finds length of parentelement
  let length = parentElement.children.length;
  //while length is > 1 --keep first child, delete rest
  while( length > 1){
    parentElement.removeChild(parentElement.lastElementChild);
    length--
  }
}

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

//Validate modal input variable types
function validateInput(input, expectedDataType, errorElement){
  //Check if the input value is the same as expected. 
  let outputVal;
  if(expectedDataType === 'int'){
    //if val is supposed to be Int. Then parse it as such
    outputVal = parseInt(input);
    //NaN check
    if (!isNaN(outputVal)){
      errorElement.style.border = 'none'
      return outputVal;
    } else{
      //if output is NaN, then throw error, or else pass it in return
      errorElement.style.border = '2px solid red'
      return false;
    }
  }
  
  if(expectedDataType === 'string'){
    if(input == ''){
      errorElement.style.border = '2px solid red'
      return false
    }else{
      //if val is supposed to be string. Then parse it as such
      outputVal = toString(input)
      errorElement.style.border = 'none'
      return outputVal;
    }

  }

}


//----------------------------------
// Update Functions
//----------------------------------


function updateDailyCalories(parent){
  //when adding or deleting item from calendar. Call this function right after.
  //takes the cal count of all calendar items. adds them together. If over daily limit, style='red', if within 200 cal under green, if more than 300 under orange 
  let domCalCounter = parent.getElementsByClassName('day-border')[0].getElementsByClassName('day-cal')[0].getElementsByClassName('cal-count')[0];
  let elements = parent.getElementsByClassName('calendar-item');
  let arrElements = Array.from(elements);
  let calorieCount = 0;
  //for each element (in the day parent), find the calorie count, then add it to calorieCount.
  arrElements.forEach(el => {
    //find element name//find element in the array.//find the element's calories//add calories calorieCount
    let elName = el.getElementsByClassName('recipe-name')[0].innerHTML
    let newRecipe = recipeBook.find(r => r.name === elName);
    let recipeCal = newRecipe.calories;
    console.log(recipeCal);
    calorieCount = calorieCount + recipeCal
  });
  //set calorie count
  domCalCounter.innerHTML = calorieCount;

  if(calorieCount > calorieGoal){
    domCalCounter.style.color = 'red'

  }else if( (calorieGoal - 200) < calorieCount && calorieCount <= calorieGoal){
    domCalCounter.style.color = 'green'
  }
  else{
    domCalCounter.style.color = 'black'
  }

}

