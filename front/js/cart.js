"use strict";

const cartItems = document.getElementById('cart__items');
const totalQuantity = document.getElementById('totalQuantity');
const totalPrice = document.getElementById('totalPrice');
const deleteBtn = document.querySelector('.deleteItem');

const itemsInCart = JSON.parse(localStorage.getItem('itemsInCart'));

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

// Create Cart Item Content Description
function createContentDescription(product) {
    const contentDescription = document.createElement('div');
    contentDescription.classList.add('cart__item__content__description');

    const productName = document.createElement('h2');
    productName.textContent = `${product.name}`;

    const productColor = document.createElement('p');
    productColor.textContent = `${product.selectedColor}`;

    const productPrice = document.createElement('p');
    productPrice.textContent = `${product.price} €`;

    contentDescription.appendChild(productName);
    contentDescription.appendChild(productColor);
    contentDescription.appendChild(productPrice);

    return contentDescription;
}

function createContentSettings(product) {
    const contentSettings = document.createElement('div');
    contentSettings.classList.add('cart__item__content__settings');

    contentSettings.appendChild(createContentSettingsQuantity(product));
    contentSettings.appendChild(createDeleteBtn());

    return contentSettings;
}

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

// Set multiple attributes
function setAttributes(element, attribute) {
    for (let key in attribute) {
        element.setAttribute(key, attribute[key]);
    }
}

function createDeleteBtn() {
    const deleteBtn = document.createElement('div');
    deleteBtn.classList.add('cart__item__content__settings__delete');

    const deleteBtnText = document.createElement('p');
    deleteBtnText.classList.add('deleteItem');
    deleteBtnText.textContent = 'Supprimer';

    deleteBtn.appendChild(deleteBtnText);

    return deleteBtn;
}

function deleteItem() {
    
}

function createContent(product) {
    const cartItemContent = document.createElement('div');
    cartItemContent.classList.add('cart__item__content')

    cartItemContent.appendChild(createContentDescription(product));
    cartItemContent.appendChild(createContentSettings(product));

    return cartItemContent;
}


function createCartItem(product) {
    const cartItem = document.createElement('article');
    cartItem.classList.add('cart__item');

    const cartItemImg = createImage(product);
    const cartItemContent = createContent(product);

    cartItem.appendChild(cartItemImg);
    cartItem.appendChild(cartItemContent);

    return cartItem
}

function main() {
    const itemsInCart = JSON.parse(localStorage.getItem('itemsInCart'));

    for (let i = 0; i < itemsInCart.length; i++) {
        if(itemsInCart[i]) {
            cartItems.appendChild(createCartItem(itemsInCart[i]));
        }
    }
}

main();

// Event Listeners
//deleteBtn.addEventListener('click', deleteItem);