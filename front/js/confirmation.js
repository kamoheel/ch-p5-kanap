//getting orderId from url
const str = window.location;
const url = new URL(str);
const id = url.searchParams.get("id");
//adding orderId to html
let orderId = document.getElementById('orderId');
orderId.innerHTML = id;