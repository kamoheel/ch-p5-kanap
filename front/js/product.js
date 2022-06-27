//Get the id number with URLSearchParams
const str = window.location;
const url = new URL(str);
const id = url.searchParams.get("id");
console.log(id);
const productURL = "http://localhost:3000/api/products/" + id;
console.log(productURL);

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
        console.log(data);
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