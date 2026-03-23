fetch("http://localhost:3000/productos/1", {
    method: "DELETE"
}).then(res => res.json()).then(data => console.log(data));