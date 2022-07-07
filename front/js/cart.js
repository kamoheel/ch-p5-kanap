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
            let getProductInfo = function(id) {
            for (j = 0; j < data.length; j++){
                if (data[j]._id == id){
                var price = data[j].price;
                let imgUrl = data[j].imageUrl;
                let description = data[j].description;
                let name = data[j].name;
                let altText = data[j].altTxt;
                //eavh value is called later with an array index getProductInfo(id)[0]
                return [price, imgUrl, description, name, altText];
                }
            }
            }
            let cartDisplay = document.getElementById('cart__items');
            let cartContent = JSON.parse(localStorage.getItem('cartItems'));
            //looping through each product of the cartContent (localStorage)
            for (let product of cartContent){
                //getting the info from the api for each product
                var productPrice = getProductInfo(product.id)[0];
                let imgURL = getProductInfo(product.id)[1];
                let description = getProductInfo(product.id)[2];
                let name = getProductInfo(product.id)[3];
                let altText = getProductInfo(product.id)[4];
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

            //Get closest id and color of an element (used for quantity changes and deleting products)
            function getClosestIdAndColor(element){
                //closest ancestor that is has the data-id attribute (article)
                let article = element.closest('[data-id]');
                //get the id of the item for which the quantity has been modified
                let cartElementId = article.getAttribute('data-id');
                //get the color
                let cartElementColor = article.getAttribute('data-color');
                return [cartElementId, cartElementColor];
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

                            let cartElementId = getClosestIdAndColor(cartItemQuantity[i])[0];
                            let cartElementColor = getClosestIdAndColor(cartItemQuantity[i])[1];
                            
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
                                
                                window.location.reload();
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

                        let cartElementId = getClosestIdAndColor(deleteButton[k])[0];
                        let cartElementColor = getClosestIdAndColor(deleteButton[k])[1];
                        let findProduct = findLS(cartElementId, cartElementColor);
                        if(findProduct){
                            //To delete the item in the localStorage array
                            cartContent.splice(cartContent.indexOf(findProduct), 1);
                            localStorage.setItem('cartItems', JSON.stringify(cartContent));
                            window.location.reload();
                            return true;
                        }                      
                    })
                }
            }
            deleteProduct();

            console.table(cartContent);

            //display total price
            let articleQuantity = document.getElementById('totalQuantity');
            articleQuantity.innerHTML = `${cartContent.length}`;

            let totalPrice = document.getElementById('totalPrice');
            let sum = 0;
            for (let l = 0; l < cartContent.length; l++) {
                sum += (cartContent[l].quantity) * (getProductInfo(cartContent[l].id)[0])
            };
            totalPrice.innerHTML = `${sum}`;
        })
        .catch(function(err){
            console.log("Une erreur est survenue")
        })

//Form Validation
let order = document.getElementById('order');
let contact = {
    firstName: document.getElementById('firstName'),
    lastName: document.getElementById('lastName'),
    address: document.getElementById('address'),
    city: document.getElementById('city'),
    email: document.getElementById('email'),
};
order.addEventListener('click', function(event){
    event.preventDefault();

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

    //validating each contact form input
    function validateFirstName(){
        let firstNameErrorMessage = document.getElementById('firstNameErrorMsg');   
        if (wordRegex(contact.firstName.value)) {
            firstNameErrorMessage.innerHTML = '';
            return true;
        } else {
            console.log('erreur firstname');
            firstNameErrorMessage.innerHTML = 'Seuls les lettres et tirets sont acceptés';
            return false;
        }
    }

    function validateLastName(){
        let lastNameErrorMessage = document.getElementById('lastNameErrorMsg');   
        if (wordRegex(contact.lastName.value)) {
            lastNameErrorMessage.innerHTML = '';
            return true;
        } else {
            console.log('erreur lastName');
            lastNameErrorMessage.innerHTML = 'Seuls les lettres et tirets sont acceptés';
            return false;
        }
    }

    function validateAddress(){
        let addressErrorMessage = document.getElementById('addressErrorMsg');
        if (addressRegex(contact.address.value)){
            addressErrorMessage.innerHTML = '';
            return true;
        } else {
            console.log('erreur address');
            addressErrorMessage.innerHTML = 'Veuillez entrer une adresse valide';
            return false;
        }
    }

    function validateCity(){
        let cityErrorMessage = document.getElementById('cityErrorMsg');   
        if (wordRegex(contact.city.value)) {
            cityErrorMessage.innerHTML = '';
            return true;
        } else {
            console.log('erreur city');
            cityErrorMessage.innerHTML = 'Seuls les lettres et tirets sont acceptés';
            return false;
        }
    }

    function validateEmail(){
        let emailErrorMessage = document.getElementById('emailErrorMsg');
        if (emailRegex(contact.email.value)) {
            emailErrorMessage.innerHTML = '';
            return true;
        } else {
            console.log('erreur email');
            emailErrorMessage.innerHTML = 'Veuillez entrer un e-mail valide';
            return false;
        }
    }

    //Sending to server only if the whole form is validated
    if (
        validateFirstName() && 
        validateLastName() && 
        validateAddress() && 
        validateCity() && 
        validateEmail()) {
    console.log("le formulaire est validé")
    console.log(contact);
    console.log(products);
    sendToServer();
    } else {
        console.log('erreur');
    }
})

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
}

















