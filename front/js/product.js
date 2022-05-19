"use strict";

const itemImg = document.querySelector('.item__img')
const productTitle = document.getElementById('title');
const productPrice = document.getElementById('price');
const productDescription = document.getElementById('description');
const colorSelect = document.getElementById('colors');
const itemQuantity = document.getElementById('quantity');
const addToCartBtn = document.getElementById('addToCart');

// get the product ID from the url
let str = window.location.href;
let url = new URL(str);
let productId = url.searchParams.get('id');

/**
 * Fetches the requested product's information
 * 
 * @returns {object} one specific product
 */
const getProductData = () => fetch(`http://localhost:3000/api/products/${productId}`)
    .then(res => {
        if (res.ok) {
            return res.json();
        }
        throw new Error ("There's an error retrieving the data")
    })
    .then(data => data)
    .catch(err => console.log(`There's an error: ${err}`));


/**
 * Updates the title tag in the head
 * 
 * @param {object} product 
 */
function updateMetaTitle(product) {
    document.title = `${product.name}`
}


const productImg = document.createElement('img');

/**
 * Updates the product's photo
 * 
 * @param {object} product 
 */
function updateItemImg(product) {

    productImg.setAttribute('src', `${product.imageUrl}`);
    productImg.setAttribute('alt', `${product.altTxt}`);

    itemImg.appendChild(productImg);
}

/**
 * Updates the product's information including product name, description, price, and color options
 * 
 * @param {object} product 
 */
function updateProductInfo(product) {
    productTitle.textContent = `${product.name}`;
    productDescription.textContent = `${product.description}`;
    productPrice.textContent = `${product.price}`;
    
    let colors = product.colors;
    colors.forEach(item => {
        let color = item;
        let option = document.createElement('option');
        option.setAttribute('value', color);
        option.textContent = color;
        colorSelect.appendChild(option);
    })
}

/**
 * Saves the selected color and quantity in the local storage
 */
async function addToCart () {
    let cart = JSON.parse(localStorage.getItem('itemsInCart')) || [];

    let item = cart.find(item => item._id === `${productId}` && item.selectedColor === `${colorSelect.value}`);

    if (`${colorSelect.value}` ==="") {
        alert("Veuillez choisir une couleur")
    } 
    if (`${itemQuantity.value}` <= 0 || `${itemQuantity.value}` > 100) {
        alert("Veuillez saisir un nombre entre 1 et 100")
    }

    if (item && `${colorSelect.value}` !== "" && `${itemQuantity.value}` <= 100 && `${itemQuantity.value}` > 0) {
        item.quantity += Number(`${itemQuantity.value}`);
        alert(`${itemQuantity.value} article(s) en ${colorSelect.value} bien ajoutés au panier`)
    } else if (`${colorSelect.value}` !== "" && `${itemQuantity.value}` <= 100 && `${itemQuantity.value}` > 0) {
        const itemData = await getProductData();
        itemData.selectedColor = `${colorSelect.value}`;
        itemData.quantity = Number(`${itemQuantity.value}`)
        itemData.price = ""
        cart.push(itemData);
        alert(`${itemQuantity.value} article(s) en ${colorSelect.value} bien ajouté(s) au panier`)
        }

        localStorage.setItem('itemsInCart', JSON.stringify(cart));
    }

/**
 * Displays the requested product's information on the product page
 * 
 */
getProductData().then((product) => {
    updateMetaTitle(product);
    updateItemImg(product);
    updateProductInfo(product);
})

// Event Listener
addToCartBtn.addEventListener('click', addToCart)
