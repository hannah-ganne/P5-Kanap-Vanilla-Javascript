"use strict";

const items = document.getElementById('items');

/**
 * Fetches the data of all the products in the database
 * 
 * @returns {Array} an array of objects (all the products in the database)
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
 * Creates info for a product card
 * 
 * @param {object} product
 * @returns {object} Product information including photo, name, and description
 */
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

/**
 * Creates a clickable product card containing product information
 * 
 * @param product 
 * @returns 
 */
function createProductCard(product) {
        const productCard = document.createElement('a');
        productCard.setAttribute('href', `./product.html?id=${product._id}`);

        const productInfo = createCardInfo(product);

        productCard.appendChild(productInfo);
        return productCard

}

/**
 * Displays product cards on the homepage
 * 
 */
getProductsData().then((products) => {
    for (const product of products) {
        if(product) {
            items.appendChild(createProductCard(product))
        }
    }
})