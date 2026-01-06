const express = require('express');
const app = express();
const PORT = 3000;

const users = {
    '1': { id: '1', name: 'John Doe', products: ['1', '2']},
    '2': { id: '2', name: 'Jane Smith'}
}

app.get('/users/:id', (req, res) => {
    const user = users[req.params.id];
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
})

app.listen(PORT, () => {
    console.log(`User service listening on port ${PORT}`)
})