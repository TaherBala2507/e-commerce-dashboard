const express = require('express');
const app = express();
const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');
const returnRoute = require('./routes/return');

app.use(express.json());
app.use('/orders', ordersRouter);
app.use('/products', productsRouter);
app.use('/return', returnRoute);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});