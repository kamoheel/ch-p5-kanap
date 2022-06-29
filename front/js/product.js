//Get the id number with URLSearchParams
const str = window.location;
const url = new URL(str);
const id = url.searchParams.get("id");
const productURL = "http://localhost:3000/api/products/" + id;

//Given the id, get all the elements to add to the specific product page
fetch(productURL, {
    method: 'GET'
})
    .then(function(res){
        if (res.ok){
            return res.json();
        }
    })
    .then((data) => {
        // console.log(data);
        let img = document.querySelector('.item__img');
        img.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}" >`;

        let title = document.getElementById('title');
        title.innerHTML = data.name;

        let price = document.getElementById('price');
        price.innerHTML = data.price;

        let description = document.getElementById('description');
        description.innerHTML = data.description;

        let color = document.getElementById('colors');
        for(i = 0; i < data.colors.length; i++) {
            color.innerHTML += `<option value="${data.colors[i]}">${data.colors[i]}</option>`;
        }
        }
    )
    .catch(function(err){
        console.log("Une erreur est survenue")
    })

    //Getting the selected values at addToCart Click
    let addToCart = document.getElementById('addToCart');

    //Add an error Message if form is incorrect
    let itemContent = document.querySelector(".item__content");
    const errorMessage = document.createElement("div");
    itemContent.appendChild(errorMessage);
    errorMessage.style.color = "red";
    errorMessage.style.backgroundColor = "#fff";
    errorMessage.style.display = "none";

    // Get quantity, if quantity !=0 
    function quantitySelected(){
        let quantity = document.getElementById('quantity');
        return quantity.value;
    }

    // Get color, if a color is selected
    function colorSelected() {
        let color = document.getElementById('colors');
        return color.value;  
    }


    addToCart.addEventListener('click', function(){ 
        let quantity = quantitySelected();
        let color = colorSelected();

        let cartContent = JSON.parse(localStorage.getItem('cartItems'));
        
        //Create an object if a color is selected and if a quantity is added
        if(color == "") {
            errorMessage.style.display = "block";
            errorMessage.innerHTML = `<p>Veuillez sélectionner une couleur</p>`;
        } else if(quantity == 0){
            errorMessage.style.display = "block";
            errorMessage.innerHTML = `<p>Veuillez saisir une quantité supérieure à 0</p>`;
        } else {
            errorMessage.style.display = "none";
            let product  = {
                id: id,
                quantity: parseInt(quantity),
                color: color
            }; 
            console.log(product);

            //if the cart has products
            if (cartContent) {
                //findProduct: is the product we want to add already in the cart? (same id + same color) 
                const findProduct = cartContent.find(
                    (element) => element.id === product.id && element.color === product.color
                );
                    //if the product is in the cart
                    if (findProduct){
                        let newQuantity = findProduct.quantity + product.quantity;
                            // making sure quantity is not over 100 items of the same product
                            if (newQuantity > 0 && newQuantity <= 100) {
                                findProduct.quantity = newQuantity;
                            } else {
                                findProduct.quantity = 100 ;
                            }
                    //if the product is not in the cart
                    } else {
                        cartContent.push(product);                        
                    }
            }
            //if the cart is empty
            else {
                cartContent = [];
                cartContent.push(product);
            }
            localStorage.setItem('cartItems', JSON.stringify(cartContent));
            console.table(cartContent);
            }        
    })

