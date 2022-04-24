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
async function getProductData() {
    const res = await fetch(`http://localhost:3000/api/products/${productId}`);
    const data = await res.json();
    return data;
}

// update meta title
function updateMetaTitle(product) {
    document.title = `${product.name}`
}

// update item image
function updateItemImg(product) {
    const productImg = document.createElement('img');
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
function addToCart () {
    let cart = JSON.parse(localStorage.getItem('itemsInCart')) || [];

    let item = cart.find(item => item.id === `${productId}` && item.color === `${colorSelect.value}`);
    if (item) {
        item.quantity = Number(item.quantity) + Number(`${itemQuantity.value}`);
    } else {
        cart.push({'id': `${productId}`, 'color': `${colorSelect.value}`, 'quantity': Number(`${itemQuantity.value}`), 'price': Number(`${productPrice.textContent}`)})
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
