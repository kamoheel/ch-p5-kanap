const str = window.location;
const url = new URL(str);
const id = url.searchParams.get("id");
let orderId = document.getElementById('orderId');
orderId.innerHTML = id;