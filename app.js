
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
domShoppingListButton.addEventListener('click', () => {
  toggleShoppingList();
})

domRecipeButton.addEventListener('click', () => {
  toggleRecipeList();
})

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

var coll = document.getElementsByClassName("recipe-item-top-bar");


for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
} 

var ingr = document.getElementsByClassName("filter-item");


for (let i = 0; i < ingr.length; i++) {
  ingr[i].addEventListener("click", function() {
    if (this.classList.contains('f-i-include')) {
      this.classList.remove('f-i-include');
      this.classList.add('f-i-exclude');
    } else if (this.classList.contains('f-i-exclude')){
      this.classList.remove('f-i-exclude');
    } else{
      this.classList.add('f-i-include');
    }
  });
} 