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

/**
 * Fetches the data of all the products in the database
 * 
 * @returns {array} an array of objects (all the products in the database)
 */
const getProductsData = () => fetch('http://localhost:3000/api/products')
    .then(res => {
            if(res.ok) {
                return res.json();
            }
            throw new Error("There's an error retrieving the data")
    })
    .then(data => data)
    .catch(err => console.log(`There's an error: ${err}`));
    

/**
 * Returns the price of a specific product in the cart
 * 
 * @param {string} id 
 * @returns {number} price
 */
async function getPrice(id) {
    const productsData = await getProductsData();
    const condition = item => item._id === id;
    const index = productsData.findIndex(condition);
    const price = productsData[index].price;
    return price
}

/**
 * Creates a div containing image of an item in the cart
 * 
 * @param {object} product 
 * @returns {object} cartItemImgEl
 */
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

/**
 * Creates a div of description of an item in the cart 
 * including product name, selected color, and price
 * 
 * @param {object} product 
 * @returns {object} contentDescription
 */
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

/**
 * Creates a div container for product quantity and delete button
 * 
 * @param {object} product 
 * @returns {object} contentSettings
 */
function createContentSettings(product) {
    const contentSettings = document.createElement('div');
    contentSettings.classList.add('cart__item__content__settings');

    contentSettings.appendChild(createContentSettingsQuantity(product));
    contentSettings.appendChild(createDeleteBtn());

    return contentSettings;
}

/**
 * Sets multiple attributes
 * 
 * @param {object} element 
 * @param {object} {'name': value}
 */
    function setAttributes(element, attribute) {
        for (let key in attribute) {
            element.setAttribute(key, attribute[key]);
        }
}

/**
 * Creates a div of product's quantity
 * 
 * @param {object} product 
 * @returns {object} contentSettingsQuantity
 */
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

    contentSettingsQuantity.appendChild(quantity);
    contentSettingsQuantity.appendChild(itemQuantity);

    return contentSettingsQuantity;
}

/**
 * Updates the product's quantity in the local storage
 * 
 * @param e 
 */
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

/**
 * Creates a delete button
 * 
 * @returns {object} deleteBtn
 */
function createDeleteBtn() {
    const deleteBtn = document.createElement('div');
    deleteBtn.classList.add('cart__item__content__settings__delete');

    const deleteBtnText = document.createElement('p');
    deleteBtnText.classList.add('deleteItem');
    deleteBtnText.textContent = 'Supprimer';

    deleteBtn.appendChild(deleteBtnText);

    return deleteBtn;
}

/**
 * Creates a content div containing content description and content settings
 * 
 * @param {object} product 
 * @returns {object} cartItemContent
 */
async function createContent(product) {
    const cartItemContent = document.createElement('div');
    cartItemContent.classList.add('cart__item__content')

    cartItemContent.appendChild(await createContentDescription(product));
    cartItemContent.appendChild(createContentSettings(product));

    return cartItemContent;
}

/**
 * Creates an article of the item 
 * 
 * @param {object} product 
 * @returns {object} cartItem
 */
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

/**
 * Displays total quantity of all the items in the cart
 */
function displayTotalQuantity() {
    let total = 0;
    itemsInCart.forEach(item => {
        total += item.quantity;
    })
    totalQuantity.textContent = total;
}

/**
 * Displays total price of all the items in the cart
 */
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

/**
 * Updates the cart page DOM
 */
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

let checkOk = true;

/**
 * Shows error message
 * 
 * @param {object} input 
 * @param {string} message 
 */
function showError(input, message) {
    const parent = input.parentElement;
    const errorMsg = parent.lastElementChild;
    errorMsg.textContent = message;
    checkOk = false;
}

/**
 * Removes error message
 * 
 * @param {object} input 
 */
function showSuccess(input) {
    const parent = input.parentElement;
    const errorMsg = parent.lastElementChild;
    errorMsg.textContent = ""
}

/**
 * Checks if first name and last name are valid
 * with non-authorized special characters and numbers
 * 
 * @param {object} input 
 */
function checkNames(input) {
    const regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;

    regex.test(input.value) ? showSuccess(input) : showError(input, 'Veuillez vérifier votre nom à nouveau')
    }

/**
 * Checks if address is valid
 * with number(s) followed by comma or space and then letters
 * 
 * @param {object} input 
 */
function checkAddress(input) {
    const regex = /^[0-9]+[,\s][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,'-]+/u;

    regex.test(input.value) ? showSuccess(input) : showError(input, 'Merci de bien vouloir enregistrer une adresse valide (ex - 29, rue Adrienne Bolland)');
}

/**
 * Checks if city name is valid
 * with non-authorized special characters and numbers
 * 
 * @param {*} input 
 */
function checkCity(input) {
    const regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    regex.test(input.value) ? showSuccess(input) : showError(input, 'Merci de bien vouloir enregistrer une ville valide')
}

/**
 * Checks if email address is valid
 * 
 * @param {*} input 
 */
function checkEmail(input) {
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    regex.test(input.value) ? showSuccess(input) : showError(input, 'Merci de bien vouloir enregistrer une adresse email valide');
}

/**
 * Handles order form submit (API POST)
 * 
 * @param e 
 */
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

/**
 * Updates the total quantity and total price
 * 
 */
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

/**
 * Deletes the item when user clicks on the Supprimer button
 */
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

/**
 * Validates user input and once validated submits the order form
 */
form.addEventListener('submit', function(e) {
    e.preventDefault();

    checkOk = true;
    checkNames(firstName);
    checkNames(lastName);
    checkAddress(address);
    checkCity(city);
    checkEmail(email);

    if (checkOk) {
        handleFormSubmit(e);
    }
}
)