const express = require('express');
const app = express();
const PORT = 3001;

const products = {
    '1': {id: 1, name: "Laptop", description: "Powerful laptop for work and play"},
    '2': {id: 2, name: "Keyboard", description: "Ergonomic keyboard for comfortable typing"}
}

app.get('/products/:id', (req, res) => {
    const product = products[req.params.id];

    if (product) {
        res.json(product)
    } else {
        res.status(404).json({message: "Product not found"})
    }
})

app.listen(PORT, () => {
    console.log(`Product service listening on port ${PORT}`)
})