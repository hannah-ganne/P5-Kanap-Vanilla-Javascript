"use strict";

const cartItems = document.getElementById('cart__items');
const totalQuantity = document.getElementById('totalQuantity');
const totalPrice = document.getElementById('totalPrice');
const deleteItem = document.querySelector('.deleteItem')

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
   

//Get Prices
async function getPrice(id) {
    const productsData = await getProductsData();
    const condition = item => item._id === id;
    const index = productsData.findIndex(condition);
    const price = productsData[index].price;
    return price
}

// Create Cart Item Image
function createImage(product) {
    const cartItemImgEl = document.createElement('div');
    cartItemImgEl.classList.add('cart__item__img');

    const cartItemImg = document.createElement('img');
    setAttributes(cartItemImg, 
        {'src': `${product.imageUrl}`, 
        'alt': `${product.altTxt}`});

    cartItemImgEl.appendChild(cartItemImg);

    return cartItemImgEl
}

// Create Cart Item Content Description div
async function createContentDescription(product) {
    const contentDescription = document.createElement('div');
    contentDescription.classList.add('cart__item__content__description');

    const productName = document.createElement('h2');
    productName.textContent = `${product.name}`;

    const productColor = document.createElement('p');
    productColor.textContent = `${product.selectedColor}`;

    const productPrice = document.createElement('p');
    const id = product._id;
    const price = await getPrice(id);
    productPrice.textContent = `${price} €`

    contentDescription.appendChild(productName);
    contentDescription.appendChild(productColor);
    contentDescription.appendChild(productPrice);

    return contentDescription;
}

// Create Cart Item Content Settings div
function createContentSettings(product) {
    const contentSettings = document.createElement('div');
    contentSettings.classList.add('cart__item__content__settings');

    contentSettings.appendChild(createContentSettingsQuantity(product));
    contentSettings.appendChild(createDeleteBtn());

    return contentSettings;
}

// Create Cart Item Content Setting Quantity div
function createContentSettingsQuantity(product) {
    const contentSettingsQuantity = document.createElement('div');
    contentSettingsQuantity.classList.add('cart__item__content__settings__quantity');

    const quantity = document.createElement('p');
    quantity.textContent = `Qté : `;

    const itemQuantity = document.createElement('input');
    itemQuantity.classList.add('itemQuantity');
    setAttributes(itemQuantity, 
        {'type': 'number', 
        'name': 'itemQuantity', 
        'min': 1, 
        'max': 100, 
        'value': `${product.quantity}`})
//    itemQuantity.setAttribute('type', 'number');
//    itemQuantity.setAttribute('name', 'itemQuantity');
//    itemQuantity.setAttribute('min', 1);
//    itemQuantity.setAttribute('max', 100);
//    itemQuantity.setAttribute('value', `${product.quantity}`);

    contentSettingsQuantity.appendChild(quantity);
    contentSettingsQuantity.appendChild(itemQuantity);

    return contentSettingsQuantity;
}

// Update Quantity in localStorage
function updateQuantity(e) {
    if (e.target.classList.contains("itemQuantity")) {
        const id = e.target.closest("article").dataset.id;
        const color = e.target.closest("article").dataset.color;
        const condition = item => item._id === id && item.selectedColor === color;
        let index = itemsInCart.findIndex(condition);
        itemsInCart[index].quantity = +e.target.value;
        localStorage.setItem('itemsInCart', JSON.stringify(itemsInCart));  
        } 
    }

// Set multiple attributes
function setAttributes(element, attribute) {
    for (let key in attribute) {
        element.setAttribute(key, attribute[key]);
    }
}

// Create a deleteItem button
function createDeleteBtn() {
    const deleteBtn = document.createElement('div');
    deleteBtn.classList.add('cart__item__content__settings__delete');

    const deleteBtnText = document.createElement('p');
    deleteBtnText.classList.add('deleteItem');
    deleteBtnText.textContent = 'Supprimer';

    deleteBtn.appendChild(deleteBtnText);

    return deleteBtn;
}


// Create Content div
async function createContent(product) {
    const cartItemContent = document.createElement('div');
    cartItemContent.classList.add('cart__item__content')

    cartItemContent.appendChild(await createContentDescription(product));
    cartItemContent.appendChild(createContentSettings(product));

    return cartItemContent;
}

// Create Cart Item article
async function createCartItem(product) {
    const cartItem = document.createElement('article');
    cartItem.classList.add('cart__item');
    setAttributes(cartItem, 
        {'data-id': product._id,
        'data-color': product.selectedColor})

    const cartItemImg = createImage(product);
    const cartItemContent = await createContent(product);

    cartItem.appendChild(cartItemImg);
    cartItem.appendChild(cartItemContent);

    return cartItem
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
    for (const item of itemsInCart) {
        const id = item._id
        const price = await getPrice(id);
        const quantity = item.quantity;
        total += (price * quantity);
    }
    totalPrice.textContent = total;
}

// Update cart page DOM
async function main() {
    for (const item of itemsInCart) {
        if (item) {
            cartItems.appendChild(await createCartItem(item))
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

    regex.test(input.value) ? showSuccess(input) : showError(input, 'Veuillez vérifier votre nom à nouveau')
    }

// Check is address is valid (number(s) followed by letters)
function checkAddress(input) {
    const regex = /^[0-9]+[,\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,'-]+/u;

    regex.test(input.value) ? showSuccess(input) : showError(input, 'Merci de bien vouloir enregistrer une adresse valide (ex - 29, rue Adrienne Bolland)');
}

// Check if city name is valid (no special characters or numbers)
function checkCity(input) {
    const regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    regex.test(input.value) ? showSuccess(input) : showError(input, 'Merci de bien vouloir enregistrer une ville valide')
}

// Check if email address is valid
function checkEmail(input) {
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    regex.test(input.value) ? showSuccess(input) : showError(input, 'Merci de bien vouloir enregistrer une adresse email valide');
}

// Handle Order Form Submit (API post)
function handleFormSubmit(e) {
    const url = 'http://localhost:3000/api/products/order';
    const contact = {
        "firstName": firstName.value,
        "lastName": lastName.value,
        "address": address.value,
        "city": city.value,
        "email": email.value
    }
    const products = [...new Set(itemsInCart.map(data => data._id))]
    const data = {
        "contact": contact,
        "products": products
    }

    const fetchOptions = {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }

    fetch (url, fetchOptions)
        .then (res =>  {
            if(res.ok) {
                return res.json();
            }
            throw new Error("There's an error sending the data")
       })
        .then (data => {
            localStorage.clear();
            document.location.href = `./confirmation.html?id=${data.orderId}`;
        })
        .catch(err => console.log(err)); 
}

// Event Listeners

//Update quantity in localStorage when the user changed manually
    document.body.addEventListener('change', function(e) {
        if (e.target.classList.contains("itemQuantity")) {
            e.stopPropagation()
            const id = e.target.closest("article").dataset.id;
            const color = e.target.closest("article").dataset.color;
            const condition = item => item._id === id && item.selectedColor === color;
            let index = itemsInCart.findIndex(condition);
            itemsInCart[index].quantity = +e.target.value;
            localStorage.setItem('itemsInCart', JSON.stringify(itemsInCart)); 
            displayTotalQuantity();     
            displayTotalPrice();  
            } 
    });

//Delete the item when the user clicked on the deleteItem button
    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains("deleteItem")) {
            e.stopPropagation()
            const id = e.target.closest("article").dataset.id;
            const color = e.target.closest("article").dataset.color;
            const condition = item => item._id === id && item.selectedColor === color;
            let index = itemsInCart.findIndex(condition);
            itemsInCart.splice(index, 1);
            localStorage.setItem('itemsInCart', JSON.stringify(itemsInCart));  
            e.target.closest("article").remove();
            displayTotalQuantity();     
            displayTotalPrice();  
            }
    });

//Validate form
form.addEventListener('submit', function(e) {
    e.preventDefault();

    checkNames(firstName);
    checkNames(lastName);
    checkAddress(address);
    checkCity(city);
    checkEmail(email);

    handleFormSubmit(e);
}
)