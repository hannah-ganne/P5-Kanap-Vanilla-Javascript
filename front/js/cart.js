const cartItems = document.getElementById('cart__items');
const totalQuantity = document.getElementById('totalQuantity');
const totalPrice = document.getElementById('totalPrice');

const itemsInCart = JSON.parse(localStorage.getItem('itemsInCart'));

// Get products data
const getProductsData = () => fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.log("There's an error retrieving the data", err));

// Update Cart Item Image
function updateCartItemImg(product) {
    const cartItemImgEl = document.createElement('div');
    cartItemImgEl.classList.add('cart__item__img');

    const cartItemImg = document.createElement('img');
    cartItemImg.setAttribute('src', `${product.imageUrl}`);
    cartItemImg.setAttribute('alt', `${product.altTxt}`);

    cartItemImgEl.appendChild(cartItemImg);
}

// update Cart Item Content Description
function updateCartItemContentDescription(product) {
    const cartItemContentDescription = document.createElement('div');
    cartItemContentDescription.classList.add('cart__item__content__description');

    const productName = document.createElement('h2');
    productName.textContent = `${product.name}`;

    const productColor = document.createElement('p');
    productColor.textContent = `${product.color}`;

    const productPrice = document.createElement('p');
    productPrice.textContent = `${product.price} €`;

    cartItemContentDescription.appendChild(productName);
    cartItemContentDescription.appendChild(productColor);
    cartItemContentDescription.appendChild(productPrice);
}

// Update Cart Item Content Settings


// Update Cart Item Content
function updateCartItemContent(product) {
    const cartItemContent = document.createElement('div');
    cartItemContent.classList.add('cart__item__content');

    cartItemContent.appendChild(cartItemContentDescription(product));
    cartItemContent.appendChild(cartItemContentSettings(product));
}

// Create a Cart Item
function createCartItem(product) {
    const cartItem = document.createElement('article');
    cartItem.classList.add('cart__item');
    cartItem.setAttribute('data-id', `{${product.id}}`);
    cartItem.setAttribute('data-color', `{${product.color}}`);

    const cartItemImg = updateCartItemImg(product);
    //const cartItemContent = updateCartItemContent(product);

    cartItem.appendChild(cartItemImg);
    //cartItem.appendChild(cartItemContent);

    return cartItem;
}

// Update Cart Page
function main() {
    for (let i = 0; i < itemsInCart.length; i++) {
        if(itemsInCart[i]) {
            cartItems.appendChild(createCartItem(itemsInCart[i]))
        }
    }
};

main();