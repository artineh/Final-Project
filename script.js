const form = document.querySelector('form');
const ul = document.querySelector('ul');
const button = document.querySelector('#clear');
const input = document.getElementById('item');
let itemsArray = [];
if(localStorage.getItem('items')){
  itemsArray = JSON.parse(localStorage.getItem('items'));
}

localStorage.setItem('items', JSON.stringify(itemsArray));
const data = JSON.parse(localStorage.getItem('items'));

const liMaker = function(text){
  const li = document.createElement('li');
  li.textContent = text;
  ul.appendChild(li);
}

form.addEventListener('submit', function (submit) {
  submit.preventDefault();
  if(input.value == ''){
    return;
  }
  itemsArray.push(input.value);
  localStorage.setItem('items', JSON.stringify(itemsArray));
  liMaker(input.value);
  input.value = "";
});

data.forEach(function(item){
  liMaker(item);
});

button.addEventListener('click', function () {
  localStorage.setItem('items', JSON.stringify([]));
  itemsArray = [];
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
});
function myFunction() {
    let x = document.getElementById("myDIV");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}