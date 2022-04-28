"use strict";

const items = document.getElementById('items');

const getProductsData = () => fetch('http://localhost:3000/api/products')
   .then(res => {
        if(res.ok) {
            return res.json();
        }
        throw new Error("There's an error retrieving the data")
   })
   .then(data => data)
   .catch(err => console.log(`There's an error: ${err}`));
   
// create product card info
function createCardInfo(product) {
    const productInfo = document.createElement('article');

    const productImg = document.createElement('img');
    productImg.setAttribute('src', `${product.imageUrl}`);
    productImg.setAttribute('alt', `${product.altTxt}`);

    const productInfoTitle = document.createElement('h3');
    productInfoTitle.classList.add('productName');
    productInfoTitle.textContent = `${product.name}`;

    const productDescription = document.createElement('p');
    productDescription.classList.add('productDescription');
    productDescription.textContent = `${product.description}`

    productInfo.appendChild(productImg);
    productInfo.appendChild(productInfoTitle);
    productInfo.appendChild(productDescription);

    return productInfo;
}

// create Product Card 
function createProductCard(product) {
        const productCard = document.createElement('a');
        productCard.setAttribute('href', `./product.html?id=${product._id}`);

        const productInfo = createCardInfo(product);

        productCard.appendChild(productInfo);

        return productCard
}

// Put the cards on the homepage
getProductsData().then((products) => {
    for (const product of products) {
        if(product) {
            items.appendChild(createProductCard(product))
        }
    }
})