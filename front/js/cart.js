
fetch("http://localhost:3000/api/products", {
        method: 'GET'
    })
        .then(function(res){
            if (res.ok){
                return res.json();
            }
        })
        .then(data=> {
            //Create a function that gets the product price, imageURL, description, name and alttext to add the appropriate info to the cart
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
            for (let product of cartContent){
                var productPrice = getProductInfo(product.id)[0];
                let imgURL = getProductInfo(product.id)[1];
                let description = getProductInfo(product.id)[2];
                let name = getProductInfo(product.id)[3];
                let altText = getProductInfo(product.id)[4];

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

            function getClosestIdAndColor(element){
                //closest ancestor that is has the data-id attribute (article)
                let article = element.closest('[data-id]');
                //get the id of the item for which the quantity has been modified
                let cartElementId = article.getAttribute('data-id');
                //get the color
                let cartElementColor = article.getAttribute('data-color');
                return [cartElementId, cartElementColor];
            }

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

                            // //closest ancestor that is has the data-id attribute (article)
                            // let article = cartItemQuantity[i].closest('[data-id]');
                            // //get the id of the item for which the quantity has been modified
                            // let idChangedQuantity = article.getAttribute('data-id');
                            // console.log(idChangedQuantity);
                            // //get the color
                            // let colorChangedQuantity = article.getAttribute('data-color');
                            // console.log(colorChangedQuantity);
                            let cartElementId = getClosestIdAndColor(cartItemQuantity[i])[0];
                            let cartElementColor = getClosestIdAndColor(cartItemQuantity[i])[1];
                            
                            //find the product in localStorage to modify the quantity stored
                            let findProduct = findLS(cartElementId, cartElementColor);
                            if (findProduct) {
                                let quantityModified = cartItemQuantity[i].valueAsNumber;
                                if (quantityModified > 100) {
                                    findProduct.quantity = 100;
                                }
                                //  else if (quantityModified = 0) {
                                //     localStorage.removeItem(findProduct);
                                //} 
                                else {
                                    findProduct.quantity = quantityModified;
                                }
                                localStorage.setItem('cartItems', JSON.stringify(cartContent));
                                console.table(cartContent);
                                return true;
                            }
                    })
                }
            }
            modifyQuantity();

            function deleteProduct() {
                let deleteButton = document.getElementsByClassName('deleteItem');
                for(let k = 0; k < deleteButton.length; k++){
                    deleteButton[k].addEventListener("click", function(event){
                        event.preventDefault();

                        let cartElementId = getClosestIdAndColor(deleteButton[k])[0];
                        let cartElementColor = getClosestIdAndColor(deleteButton[k])[1];
                        let findProduct = findLS(cartElementId, cartElementColor);
                        if(findProduct){
                            console.log(findProduct.id);
                            console.log(findProduct.quantity);
                            console.log(findProduct);
                            //To delete the item in the localStorage array
                            cartContent.splice(findProduct, 1);
                            localStorage.setItem('cartItems', JSON.stringify(cartContent));
                            console.table(cartContent);
                            window.location.reload();
                            return true;
                        }                      
                    })
                }
            }
            deleteProduct();


            
            
        })
        .catch(function(err){
            console.log("Une erreur est survenue")
        })








