
//-------------------------------------
//Fetch JSON Data from Github Page
//-------------------------------------
//import * as data from jsonDataURL;
//const jsonDataURL = "https://cables97.github.io/MealMaker/src/meals.json";
const jsonDataURL = './src/meals.json'
async function fun() {
  return fetch(jsonDataURL).then(res => res.json());
  }
const recipeImport  = await fun();
let recipeBook = [];

loadList();

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




//----------------------------------
// Global Variables
//----------------------------------
let grabbedObj; 

let metricToggle = false;

let shoppingList = [];//[["ingredient", [quantity, Unit of measure], [quantity, Unit of measure]], ["ingredient", [quantity, Unit of measure], [quantity, Unit of measure], [quantity, Unit of measure]]]

let arrUnits = ['lbs', 'oz', 'fl.oz','cups','ts', 'tbs', 'kg', 'g', 'mg', 'mL', 'L', 'Units' ]

let calorieGoal = 1200; 

function Ingredient(name) {
  this.name = name;

  this.lbs = 0;
  this.oz = 0;
  this.cups = 0;
  this.tbs = 0;
  this.ts = 0;

  this.kg = 0;
  this.g = 0;
  this.mg = 0;
  this.liter = 0;
  this.ml = 0;

  this.units = 0;
}

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
let filterBtns = document.getElementsByClassName("filter-item");
for (let index = 0; index < filterBtns.length; index++) {
  filterBtns[index].addEventListener("click", function() {
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

//Slider
document.getElementById("calorie-slider").addEventListener('input', updateCalorieSlider);

//searchbar
document.getElementById("filter-search").addEventListener("input", searchBar);

//Modal inner functions
document.getElementById('recipe-add-step').addEventListener('click', addRecipeStep);
document.getElementById('add-recipe-btn').addEventListener('click', addRecipe);
document.getElementById('recipe-add-ingr').addEventListener('click', addRecipeIngr);
//modal Open

document.getElementById('modal-close').addEventListener('click', toggleModal);

//document.getElementById('add-recipe').addEventListener('click', toggleModal);

document.getElementById('add-recipe').addEventListener('click', toggleModal);
document.getElementById('download-list').addEventListener('click', downloadList);
document.getElementById('import-data').addEventListener('click', importData);


window.addEventListener("keydown", evt => {
  const key = evt.key; // const {key} = event; in ES6+
  if (key === "Escape") {
    domModal.style.display = "none";
    console.log("closing modal");
  }
});

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

//shows error box 
function throwErrorWindow(type, errorString){
  //Takes input val, pushes it to error box, then has error box play show animation
  let errorWindow = document.getElementById('error-window');
  let errorWindowText = errorWindow.getElementsByClassName('text')[0];
  errorWindowText.innerHTML = errorString;
  errorWindow.style.display = "";
  errorWindow.addEventListener('click', ()=>{
    errorWindow.style.opacity = '0';
    errorWindow.classList.remove('error-window-pop');
  })
  errorWindow.querySelectorAll('i')[0].classList.remove("fa-triangle-exclamation", "fa-bell", "fa-circle-check")
  switch(type){
    case "warn":
        errorWindow.querySelectorAll('i')[0].classList.add("fa-triangle-exclamation");
    break;

    case "alert":
      errorWindow.querySelectorAll('i')[0].classList.add("fa-bell");
    break;

    default:
      errorWindow.querySelectorAll('i')[0].classList.add("fa-circle-check");
    break;
  }

  errorWindow.classList.remove('error-window-pop');
  errorWindow.offsetWidth;
  errorWindow.classList.add('error-window-pop');
  errorWindow.preventDefault;

  setTimeout( ()=>{
    errorWindow.style.display = "none";
  }, 5000)
}

//shows cursor error 
function throwErrorCursor(errorString){
  //small pop up offset from cursor, 1em diag. Fades after 10sec.
  let errorWindow = document.getElementById('cursor-error');
  let errorWindowText = errorWindow.getElementsByClassName('text')[0];

  console.log(mouseY + 'px');
  console.log(mouseX + 'px');
  errorWindow.style['top'] = mouseY - 225 + 'px';
  errorWindow.style['left']  = mouseX + 'px';

  errorWindowText.innerHTML = errorString;

  errorWindow.classList.remove('error-window-pop');
  errorWindow.offsetWidth;
  errorWindow.classList.add('error-window-pop');
  errorWindow.preventDefault;
}


//----------------------------------
// Drag n Drop Functions
//----------------------------------



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
      console.log("drop: " + newRecipe.name);
      recipeDropToShoppingList(newRecipe);
      buildCalenderItem(event.target, newRecipe);
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
  let recipeId = recipe.id;

  throwErrorWindow("alert", recipeName + ", added to calendar");
 //Calender Item Recipe Box
  let divCalenderItem = document.createElement("div");
  divCalenderItem.classList.add('calendar-item');
  divCalenderItem.classList.add('draggable');
  divCalenderItem.draggable = 'true';
  divCalenderItem.id = recipeId;
  parent.append(divCalenderItem);
  divCalenderItem.addEventListener("dragstart", (event) => {
    console.log('drag');
    drag(event)
  });

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
        deleteCalendarListItem(divCalenderItem)
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
  console.log("arringr: " + arrIngr )
  let ingrName = arrIngr[0];
  let ingrQnty = parseFloat(arrIngr[1][0]);
  let ingrUnit = arrIngr[1][1];
  let ingrBool ;
  //console.log("ingrQnty : " + ingrQnty + "    ingrName: " + ingrName + "    ingrUnit : " + ingrUnit  )
  //Search the ingredient List for ingredient. If on it, sets the bool to true.
  shoppingList.forEach(element => {
    if(element.name == (ingrName)){
      ingrBool = true;
      //(ingrBool) ? console.log(ingrName +' in list') : (ingrName +' not in list');
    }
  });

  if(!ingrBool){//if ingr not on list, adds it
    const newIngr = new Ingredient(arrIngr[0]);
    newIngr[ingrUnit] = newIngr[ingrUnit] + ingrQnty;
    shoppingList.push(newIngr);
    //console.log( "newIngr[ingrUnit] :  " + newIngr[ingrUnit])
  }else{//Adds the ingredient together
    let index = shoppingList.findIndex(x => x.name === ingrName);
    let existIngr = shoppingList[index];
    existIngr[ingrUnit] = parseFloat(existIngr[ingrUnit]) + ingrQnty;
    //console.log("existIngr[ingrUnit] : " + existIngr[ingrUnit])
  }
  updateShoppingList()
}


//clears shoppinglistcontaier, rebuilds all list items from shopping list
function updateShoppingList(){
  //console.log("updateShoppingList : ")
  //console.log(shoppingList)
  //delete all children
  while (domShoppingListCont.firstChild) {
    domShoppingListCont.removeChild(domShoppingListCont.firstChild);
  }
  //For each shopping List item, build shoppingList Item
  shoppingList.forEach(ingredient => {
    buildShoppingListItem(ingredient)
  });

}


//creates ShoppingListItem in DOM
function buildShoppingListItem(ingredient){
  //input: ["ingredient", [quantity, Unit of measure], [quantity, Unit of measure]
  //when item is dropped on calc. Adds the ingr. 

  let ingrName = ingredient.name;
  
  let newItem = simplifyIngredient(ingredient, metricToggle);
  let output = "";

  if(metricToggle){
    (newItem.kg > 0) ? output += newItem.kg + " kg ": null ;
    (newItem.liter > 0) ? output += newItem.liter + " liter ": null ;
    (newItem.units > 0) ? output += newItem.units + " units ": null ;
  } else{
    (newItem.lbs > 0) ? output += newItem.lbs + " lbs ": null ;
    (newItem.cups > 0) ? output += newItem.cups + " cups ": null ;
    (newItem.units > 0) ? output += newItem.units + " units ": null ;
  }
//round ingr units to 
  console.log("add ingr to shoppinglist : " + ingrName);

  let divListItem = document.createElement('div')
  divListItem.classList.add('list-item');
  domShoppingListCont.append(divListItem);

    let divItemName = document.createElement('div');
    divItemName.classList.add('item-name');
    divListItem.append(divItemName);

      let pItemName = document.createElement('p');
      pItemName.innerHTML = ingrName.split(/-/).join(" ");
      divItemName.append(pItemName);

    let divItemQnty = document.createElement('div');
    divItemQnty.classList.add('item-qnty');
    divListItem.append(divItemQnty);

      let pItemQnty = document.createElement('p');
      pItemQnty.innerHTML = output;
      divItemQnty.append(pItemQnty);

}

//Rounds values to highest simple units
function simplifyIngredient(ingredient, metricToggle){
  let ingrCopy = JSON.parse(JSON.stringify(ingredient));
  ingrCopy.name = "donald"
  if(ingrCopy.ts > 0){
    if(ingrCopy.ts < 2){
      ingrCopy.tbs += 1
    }else{
      ingrCopy.tbs += ingrCopy.ts / 3;
    }
    ingrCopy.ts = 0;
  }

  if(ingrCopy.tbs > 0){
    ingrCopy.cups += ingrCopy.tbs / 16;
    ingrCopy.tbs = 0;
  }

  if(ingrCopy.oz > 0){
    ingrCopy.lbs += ingrCopy.oz / 16;
    ingrCopy.oz = 0;
  }

  if(ingrCopy.ml > 0){
    ingrCopy.liter += ingrCopy.ml / 1000;
    ingrCopy.ml = 0;
  }

  if(ingrCopy.mg > 0){
    ingrCopy.g += ingrCopy.mg / 10;
    ingrCopy.mg = 0;
  }

  if(ingrCopy.g > 0){
    ingrCopy.kg += ingrCopy.g / 1000;
    ingrCopy.g = 0;
  }

if(!metricToggle){
  if(ingrCopy.kg > 0){
    ingrCopy.lbs += ingrCopy.kg * 2.2;
    ingrCopy.lbs = roundNumbers(ingrCopy.lbs);
    ingrCopy.kg = 0;
  }
  if(ingrCopy.liter > 0){
    ingrCopy.cups += ingrCopy.liter * 4.2;
    ingrCopy.cups = roundNumbers(ingrCopy.cups);
    ingrCopy.liter = 0;
  }
} else{
  if(ingrCopy.lbs > 0){
    ingrCopy.kg += ingrCopy.lbs / 2.2;
    ingrCopy.kg = roundNumbers(ingrCopy.kg);
    ingrCopy.lbs = 0;
  }
  if(ingrCopy.cups > 0){
    ingrCopy.liter += ingrCopy.cups / 4.2;
    ingrCopy.liter = roundNumbers(ingrCopy.liter);
    ingrCopy.cups = 0;
  }
}
  console.log(ingrCopy);
  return ingrCopy;
}
//rounds to nearest 0.X 
function roundNumbers(num){
  return Math.ceil(num * 10) / 10;
}

//Delete Calendar List Item
function deleteCalendarListItem(calendarParent){
  const recName = calendarParent.getElementsByClassName('recipe-name')[0].innerHTML;
  //find calendar item's ingr arrays
  const recipe = recipeBook.find(o => o["name"] === recName)
  const ingrList = recipe['ingredients'];
  //pass all ingrs to removeIngredientFromShoppingList
  ingrList.forEach(element => {
    removeIngredientFromShoppingList(element);
  });
  //delete calendar item
  calendarParent.remove()
}

//removes all ingredient from a recipe input format = ["ingredient", [quantity, Unit of measure]]
function removeIngredientFromShoppingList(arrIngr){
  const ingrName = arrIngr[0];
  const ingrQnty = arrIngr[1][0];
  const ingrUnit = arrIngr[1][1];
  //find ingredient index in list by name, 
  console.log(ingrName + ' already on list');
  //find matching ingr in shoppinglist
  const index = shoppingList.findIndex(x => x["name"] == ingrName)
  const listItem = shoppingList[index];
  if(shoppingList[index]){
    listItem[ingrUnit] -= ingrQnty;
  }
  if(listItem.lbs == 0 && listItem.oz == 0 && listItem.cups == 0 && listItem.tbs == 0 && listItem.ts == 0 && 
    listItem.kg == 0 && listItem.g == 0 && listItem.mg == 0 && listItem.ml == 0 && listItem.liter == 0 && listItem.units == 0){
      shoppingList.splice(index, 1);
  }
  console.log(shoppingList);
  updateShoppingList();
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
    throwErrorWindow("warn", 'There seems to be an issue with the values entered');
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

      let qnty = parseInt(element.getElementsByClassName('ingr-qnty')[0].value)
      let newIngredientQnty = []
        newIngredientQnty.push(qnty);
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

document.getElementById("calorie-goal-display").innerHTML = document.getElementById("calorie-slider").value
function updateCalorieSlider(){
  calorieGoal = document.getElementById("calorie-slider").value;
  console.log("cal goal: " + calorieGoal);
  document.getElementById("calorie-goal-display").innerHTML = document.getElementById("calorie-slider").value;

  let calendarBlocks = document.querySelectorAll(".day");
  calendarBlocks.forEach(element => {
    updateDailyCalories(element);
  });




}

function searchBar(){
  let input = document.getElementById("filter-search")
  let filter = input.value.toUpperCase();
  let recit = domRecipeContainer.querySelectorAll(".recipe-item");
  console.log(recit);

  for (let i = 0; i < recit.length; i++){
    let a =  recit[i].getElementsByTagName('div')[0].getElementsByTagName("p")[0];
    console.log(a.innerHTML);
    if(a.innerHTML.toUpperCase().indexOf(filter) > -1){
      recit[i].style.display = "";
    }else{
      recit[i].style.display = "none";
    }
  }
}

function downloadList(){
  console.log("Shopping list length: " + shoppingList.length);
  if(shoppingList.length > 0){
    download(JSON.stringify(shoppingList), "dlText.txt", "text/plain"); 
  }
  else{
    throwErrorWindow("alert", "Shopping List is empty");
  }
}

function saveLists(){
  localStorage.setItem("recipe-book", recipeBook);
}

function loadList(){
  recipeBook = [];
  let local = localStorage.getItem("recipe-book");
  recipeBook = recipeImport.concat(local);
}

function importData(){
  throwErrorCursor("This function is not fully implemented yet, sorry!")
}