const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.post('/products', verifyToken, verifyAdmin, async (req, res) => {
  const { name, basePrice } = req.body;

  if (!name || !basePrice) {
    return res.status(400).send({ message: 'Product name & base price required' });
  }

  try {
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      existingProduct.basePrice = basePrice;
      await existingProduct.save();
      return res.status(200).send({ message: 'Product updated successfully' });
    }

    const newProduct = new Product({ name, basePrice });
    await newProduct.save();
    res.status(201).send({ message: 'Product added successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
});

router.get('/products', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
});

module.exports = router;
