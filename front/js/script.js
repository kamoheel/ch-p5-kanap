fetch("http://localhost:3000/api/products", {
    method: 'GET'
})
    .then(function(res){
        if (res.ok){
            return res.json();
        }
    })
    .then(data=> {
        console.log(data);
        let itemsDiv = document.getElementById('items');
        for(let i = 0; i < data.length; i++){
            const itemCard = `
              <a href="./product.html?id=${data[i]._id}">
                <article>
                  <img
                    src="${data[i].imageUrl}"
                    alt="${data[i].altTxt}"
                  />
                  <h3 class="productName">${data[i].name}</h3>
                  <p class="productDescription">
                    ${data[i].description}
                  </p>
                </article>
              </a>
            `;
            itemsDiv.innerHTML += itemCard;

        }
    })
    .catch(function(err){
        console.log("Une erreur est survenue")
    })
