const metaTitle = document.getElementsByTagName('title');
const itemImg = document.querySelector('item__img')
const productTitle = document.getElementById('title');
const productPrice = document.getElementById('price');
const productDescription = document.getElementById('description');
const colorSelect = document.getElementById('colors');
const itemQuantity = document.getElementById('quantity');
const addToCardBtn = document.getElementById('addToCart');

async function getProductsData() {
    const res = await fetch('http://localhost:3000/api/products');
    const data = await res.json();
    return data;
}
