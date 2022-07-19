//creating an array which will contain products ids only
let products = [];

fetch("http://localhost:3000/api/products", {
        method: 'GET'
    })
        .then(function(res){
            if (res.ok){
                return res.json();
            }
        })
        .then(data=> {
            //Creating a function that gets the product info from the api given a specific id
            function getProductInfo(id) {
                for (j = 0; j < data.length; j++){
                    if (data[j]._id == id){
                        var productInfo = {
                            "price": data[j].price,
                            "imgUrl": data[j].imageUrl,
                            "description": data[j].description,
                            "name": data[j].name,
                            "altText": data[j].altTxt
                        };
                        return productInfo;
                    }
                }
            }
            let cartDisplay = document.getElementById('cart__items');
            let cartContent = JSON.parse(localStorage.getItem('cartItems'));
            //looping through each product of the cartContent (localStorage)
            if(cartContent){
            for (let product of cartContent){
                let pInfo = getProductInfo(product.id);
                //getting the info from the api for each product
                const productPrice = pInfo.price;
                const imgURL = pInfo.imgUrl;
                const name = pInfo.name;
                const altText = pInfo.altText;
                //populating the array products for the post request later
                products.push(product.id);
                //create Article so that the products are displayed as a list
                let itemArticle = document.createElement("article");
                cartDisplay.appendChild(itemArticle);
                itemArticle.className = "cart__item";
                itemArticle.setAttribute("data-id", product.id);
                itemArticle.setAttribute("data-color", product.color);
                //adding the rest of the html
                itemArticle.innerHTML = `
                <div class="cart__item__img">
                <img src="${imgURL}" alt="${altText}">
                </div>
                <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${name}</h2>
                    <p id="product-color">${product.color}</p>
                    <p>${productPrice} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
                </div>
                `;
                
            }
        } else {
            let emptyCart = document.createElement("p");
            cartDisplay.appendChild(emptyCart);
            emptyCart.innerHTML = `Votre panier est vide <a href="./index.html"> Cliquez ici pour accéder aux produits </a>`
        }

            //Get closest id and color of an element (used for quantity changes and deleting products)
            function getClosestIdAndColor(element){
                //closest ancestor that is has the data-id attribute (article)
                let article = element.closest('[data-id]');
                //get the id of the item for which the quantity has been modified
                let cartElementId = article.getAttribute('data-id');
                //get the color
                let cartElementColor = article.getAttribute('data-color');
                return { 
                    id: cartElementId, 
                    color: cartElementColor
                };
            }

            //Finding the product (same id and color) in localStorage cartContent
            function findLS(id, color){
                const findProductLS = cartContent.find(
                    (element) => element.id === id && element.color === color
                );
                return findProductLS;
            }

            //Handle modification of quantity in the cart
            function modifyQuantity(){
                //getting the list of itemQuantity Classes
                let cartItemQuantity = document.getElementsByClassName('itemQuantity');
                // Loop through each class = cartItem
                for (let i = 0; i < cartItemQuantity.length; i++){
                        //Monitor a change in quantity
                        cartItemQuantity[i].addEventListener('change', function(event){
                            event.preventDefault();
                            let cartElementId = getClosestIdAndColor(cartItemQuantity[i]).id;
                            let cartElementColor = getClosestIdAndColor(cartItemQuantity[i]).color;
                            //find the product in localStorage to modify the quantity stored
                            let findProduct = findLS(cartElementId, cartElementColor);
                            if (findProduct) {
                                let quantityModified = cartItemQuantity[i].valueAsNumber;
                                if (quantityModified > 100) {
                                    findProduct.quantity = 100;
                                }
                                else if (quantityModified == 0) {
                                    cartContent.splice(cartContent.indexOf(findProduct), 1);
                                } 
                                else {
                                    findProduct.quantity = quantityModified;
                                }
                                localStorage.setItem('cartItems', JSON.stringify(cartContent));
                                articleQtyCalculation();
                                totalCalculation();
                                return true;
                            }
                    })
                }
            }
            modifyQuantity();

            //Handle deleting a product in the cart
            function deleteProduct() {
                let deleteButton = document.getElementsByClassName('deleteItem');
                for(let k = 0; k < deleteButton.length; k++){
                    deleteButton[k].addEventListener("click", function(event){
                        event.preventDefault();
                        let deleteConfirmation = confirm("Supprimer le produit du panier?");
                        if (deleteConfirmation == true) {
                            let cartElementId = getClosestIdAndColor(deleteButton[k]).id;
                            let cartElementColor = getClosestIdAndColor(deleteButton[k]).color;
                            let findProduct = findLS(cartElementId, cartElementColor);
                            if(findProduct){
                                //To delete the item in the localStorage array
                                cartContent.splice(cartContent.indexOf(findProduct), 1);
                                localStorage.setItem('cartItems', JSON.stringify(cartContent));
                                window.location.reload();
                                return true;
                            } 
                        }  else {
                            return false;
                        }                   
                    })
                }
            }
            deleteProduct();

            console.table(cartContent);
            //display total number of products
            function articleQtyCalculation(){
            let articleQuantitySum = 0;
            let articleQuantity = document.getElementById('totalQuantity');
            for (let product of cartContent){
                articleQuantitySum += product.quantity;
            }
            articleQuantity.innerHTML = articleQuantitySum;
            };
            articleQtyCalculation();

            //display total price
            function totalCalculation(){
            let totalPrice = document.getElementById('totalPrice');
            let sum = 0;
            for (let l = 0; l < cartContent.length; l++) {
                sum += (cartContent[l].quantity) * (getProductInfo(cartContent[l].id).price)
            };
            totalPrice.innerHTML = `${sum}`;
            };
            totalCalculation();
        })
        .catch(function(err){
            console.log("Une erreur est survenue")
        })

//Form Validation
//creating Regex for the different form's inputs 
function wordRegex(value){
    return /^[A-Z][A-Za-z\é\è\ê\-]+$/.test(value);
} //accepte lettres minuscules, majuscule, tiret, espace (s), plusieurs iterations(+)

function addressRegex(value){
    return /^[a-zA-Z0-9\s,'-]*$/.test(value);
}

function emailRegex(value){
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);
}

let wordErrorMessage = 'Seuls les lettres et tirets sont acceptés';
let addressErrorMessage = 'Veuillez entrer une adresse valide';
let emailErrorMessage = 'Veuillez entrer un e-mail valide';

//validating each contact form input
let contact = {
    firstName: document.getElementById('firstName'),
    lastName: document.getElementById('lastName'),
    address: document.getElementById('address'),
    city: document.getElementById('city'),
    email: document.getElementById('email'),
};

function validate(errorMsg, regex, userInput, message){
        let inputErrorMessage = document.getElementById(errorMsg);
        if (userInput.value == ""){
            inputErrorMessage.innerHTML = message;
            return false;
        } else if (!regex(userInput.value)) {
            inputErrorMessage.innerHTML = message;
            return false;
        } else if(regex(userInput.value)) {
            inputErrorMessage.innerHTML = '';
            return true;
        }
}
//for the validation to work while changing
let firstNameInput = document.getElementById('firstName');
firstNameInput.addEventListener('change', function(){
    validate('firstNameErrorMsg', wordRegex, contact.firstName, wordErrorMessage);
});

let lastNameInput = document.getElementById('lastName');
lastNameInput.addEventListener('change', function(){
    validate('lastNameErrorMsg', wordRegex, contact.lastName, wordErrorMessage);
});

let addressInput = document.getElementById('address');
addressInput.addEventListener('change', function(){
    validate('addressErrorMsg', addressRegex, contact.address, addressErrorMessage); 
});

let cityInput = document.getElementById('city');
cityInput.addEventListener('change', function(){
    validate('cityErrorMsg', wordRegex, contact.city, wordErrorMessage);
});

let emailInput = document.getElementById('email');
emailInput.addEventListener('change', function(){
    validate('emailErrorMsg', emailRegex, contact.email, emailErrorMessage);
});

let order = document.getElementById('order');
order.addEventListener('click', function(event){
    event.preventDefault();
    //Sending to server only if the whole form is validated and if the cart is not empty
    if (
        validate('firstNameErrorMsg', wordRegex, contact.firstName, wordErrorMessage) && 
        validate('lastNameErrorMsg', wordRegex, contact.lastName, wordErrorMessage) &&
        validate('addressErrorMsg', addressRegex, contact.address, addressErrorMessage) && 
        validate('cityErrorMsg', wordRegex, contact.city, wordErrorMessage) && 
        validate('emailErrorMsg', emailRegex, contact.email, emailErrorMessage) && 
        products.length > 0) {
    sendToServer();
    localStorage.clear();
    } else {
        console.log('erreur de validation');
    }
});

//Sending to server contact object and products array and getting an orderId
function sendToServer(){
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({contact, products})
        })
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .then((server) => {
            let orderId = server.orderId;
            console.log(orderId);
            if (orderId !=""){
                location.href = "confirmation.html?id=" + orderId;
            }
        });
};