"use strict";

const itemImg = document.querySelector('.item__img')
const productTitle = document.getElementById('title');
const productPrice = document.getElementById('price');
const productDescription = document.getElementById('description');
const colorSelect = document.getElementById('colors');
const itemQuantity = document.getElementById('quantity');
const addToCartBtn = document.getElementById('addToCart');

// get the product ID
let str = window.location.href;
let url = new URL(str);
let productId = url.searchParams.get('id');

// get product data
const getProductData = () => fetch(`http://localhost:3000/api/products/${productId}`)
.then(res => {
    if(res.ok) {
        return res.json();
    }
    throw new Error("There's an error retrieving the data")
})
.then(data => data)
.catch(err => console.log(`There's an error: ${err}`));

// update meta title
function updateMetaTitle(product) {
    document.title = `${product.name}`
}

// update item image
const productImg = document.createElement('img');
function updateItemImg(product) {

    productImg.setAttribute('src', `${product.imageUrl}`);
    productImg.setAttribute('alt', `${product.altTxt}`);

    itemImg.appendChild(productImg);
}

// update product info
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

// Save items in localStorage (Add to cart button)

async function addToCart () {
    let cart = JSON.parse(localStorage.getItem('itemsInCart')) || [];

    let item = cart.find(item => item._id === `${productId}` && item.selectedColor === `${colorSelect.value}`);
    if (item && `${colorSelect.value}` !== "" && `${itemQuantity.value}` <= 100 && `${itemQuantity.value}` > 0) {
        item.quantity += Number(`${itemQuantity.value}`);
    } else if (`${colorSelect.value}` !== "" && `${itemQuantity.value}` <= 100 && `${itemQuantity.value}` > 0) {
        const itemData = await getProductData();
        itemData.selectedColor = `${colorSelect.value}`;
        itemData.quantity = Number(`${itemQuantity.value}`)
        itemData.price = ""
        cart.push(itemData);
        }

        localStorage.setItem('itemsInCart', JSON.stringify(cart));
    }



// update DOM
async function main() {
    const productData = await getProductData();
    updateMetaTitle(productData);
    updateItemImg(productData);
    updateProductInfo(productData);
}

main();

// Event Listener
addToCartBtn.addEventListener('click', addToCart)
