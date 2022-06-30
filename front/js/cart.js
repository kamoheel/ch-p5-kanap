
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
                for (i = 0; i < data.length; i++)

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
                    <p>${product.color}</p>
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
                </article>`;
            }
        })
        .catch(function(err){
            console.log("Une erreur est survenue")
        })








