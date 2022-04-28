"use strict";

const cartItems = document.getElementById('cart__items');
const totalQuantity = document.getElementById('totalQuantity');
const totalPrice = document.getElementById('totalPrice');

const form = document.querySelector('.cart__order__form');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');

let itemsInCart = JSON.parse(localStorage.getItem('itemsInCart'));

const getProductsData = () => fetch('http://localhost:3000/api/products')
   .then(res => {
        if(res.ok) {
            return res.json();
        }
        throw new Error("There's an error retrieving the data")
   })
   .then(data => data)
   .catch(err => console.log(`There's an error: ${err}`));
   
const getPrice = (id) => getProductsData()
.then(products => {
    const index = products.findIndex(item => item._id === id)
    const price = products[index].price
    return price})

// async function getPrice(id) {
//     const productsData = await getProductsData();
//     const condition = item => item._id === id;
//     const index = productsData.findIndex(condition);
//     const price = productsData[index].price;
//     return price
// }

// Update Quantity in localStorage
function updateQuantity(e) {
    if (e.target.classList.contains("itemQuantity")) {
        const id = e.target.closest("article").dataset.id;
        const color = e.target.closest("article").dataset.color;
        const condition = item => item._id === id && item.selectedColor === color;
        let index = itemsInCart.findIndex(condition);
        itemsInCart[index].quantity = +e.target.value;
        localStorage.setItem('itemsInCart', JSON.stringify(itemsInCart)); 
        displayTotalQuantity();     
        displayTotalPrice();  
        } 
    }

// Display total quantity
function displayTotalQuantity() {
    let total = 0;
    itemsInCart.forEach(item => {
        total += item.quantity;
    })
    totalQuantity.textContent = total;
}

// Display total price
async function displayTotalPrice() {
    let total = 0;
    for (let i = 0; i < itemsInCart.length; i++) {
        const id = itemsInCart[i]._id
        const price = await getPrice(id);
        const quantity = itemsInCart[i].quantity;
        total += (price * quantity);
    }
    totalPrice.textContent = total;
}

// Update Cart Page DOM
async function main() {
    for (const item of itemsInCart) {
        const cartItem = document.createElement('article');
        cartItem.classList.add('cart__item');
        cartItem.setAttribute('data-id', `${item._id}`);
        cartItem.setAttribute('data-color', `${item.selectedColor}`);

        const price = await getPrice(item._id);
    
        cartItem.innerHTML = `<div class="cart__item__img">
            <img src="${item.imageUrl}" alt="${item.altTxt}">
            </div>
            <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${item.name}</h2>
                <p>${item.selectedColor}</p>
                <p>${price} €</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
                </div>
            </div>
            </div>`

        if(item) {
            cartItems.appendChild(cartItem);
        }
    }

    displayTotalQuantity();
    displayTotalPrice();    
}

main();


// Show input error message
function showError(input, message) {
    const parent = input.parentElement;
    const errorMsg = parent.lastElementChild;
    errorMsg.textContent = message;
}

// Show success (remove error message)
function showSuccess(input) {
    const parent = input.parentElement;
    const errorMsg = parent.lastElementChild;
    errorMsg.textContent = ""
}

// Check if First Name and Last Name are valid (no special characters or numbers)
function checkNames(input) {
    const regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;

    regex.test(input.value) ? showSuccess(input) : showError(input, 'Please check your name again')
    }

// Check if city name is valid (no special characters or numbers)
function checkCity(input) {
    const regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    regex.test(input.value) ? showSuccess(input) : showError(input, 'Please enter a valid city name')
}

// Check if email address is valid
function checkEmail(input) {
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    regex.test(input.value) ? showSuccess(input) : showError(input, 'Please enter a valid email address');

}

// Event Listeners

//Update quantity in localStorage when the user changed manually
document.body.addEventListener('change', updateQuantity);

//Delete the item when the user clicked on the deleteItem button
document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains("deleteItem")) {
        const id = e.target.closest("article").dataset.id;
        const color = e.target.closest("article").dataset.color;
        const condition = item => item._id === id && item.selectedColor === color;
        let index = itemsInCart.findIndex(condition);
        itemsInCart.splice(index, 1);
        localStorage.setItem('itemsInCart', JSON.stringify(itemsInCart));        
        }
        cartItems.innerHTML = "";
        main();
});

//Validate form
form.addEventListener('submit', function(e) {
    e.preventDefault();

    checkNames(firstName);
    checkNames(lastName);
    checkCity(city);
    checkEmail(email);
})
