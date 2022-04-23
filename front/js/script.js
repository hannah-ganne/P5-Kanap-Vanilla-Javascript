const items = document.getElementById('items');

//async function getProductsData() {
  //  const res = await fetch('http://localhost:3000/api/products');
  //  const data = await res.json();
  //  return data;
//}
const getProductsData = () => fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.log("There's an error retrieving the data", err));

// create product card info
function createCardInfo(product) {
    const productInfo = document.createElement('article');

    const productImg = document.createElement('img');
    productImg.setAttribute('src', `${product.imageUrl}`);
    productImg.setAttribute('alt', `Lorem ipsum dolor sit amet, ${product.name}`);

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
const main = async () => {
    const productsData = await getProductsData();

    for (let i = 0; i < productsData.length; i++) {
        if(productsData[i]) {
            items.appendChild(createProductCard(productsData[i]))
        }
    }
}

main();