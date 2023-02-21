import express from 'express';
import bcrypt from 'bcrypt';
import { validateRegistration } from './middleware/validator.js';

import {
  getUser, postNewUser,
  getProducts, getProduct, getStoreProducts, postNewProduct, updateProductDetail, deleteProduct,
  getStores
} from './mongodb.js';

import dotenv from 'dotenv';
import pkg from 'jsonwebtoken';
import cors from "cors";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors())

// registration route -----------------------------------------------------------

app
  .route('/user/register')
    .post(async (req, res) => {
      const { error } = validateRegistration(req.body);
      if (error) {
        return res
          .status(400)
          .json({message: `${error.details[0].message}`})
      }

      const { email, password, role, uniqueStoreId } = req.body;
      const existingUser = await getUser(email)
      if (existingUser[0]) {
        return res
          .status(400)
          .json({
            success: false,
            registered: false,
            alreadyRegistered: true,
            message: `User (${email}) is already registered`
          }); 
      }

      const hashPassword = await bcrypt.hash(password, 8)
      await postNewUser({
        email: email,
        password: hashPassword,
        role: role,
        uniqueStoreId: uniqueStoreId,
      })

      const newUser = await getUser(email)
      return res
        .setHeader('content-type', 'application/json')
        .setHeader('location', `/api/user/${newUser[0].id}`)
        .status(200)
        .json({
          success: true,
          email: email,
          registered: true,
          alreadyRegistered: false,
          message: `User (${email}) is now registered`
        })
    })

// login route -------------------------------------------------------------------

app
  .route('/user/login')
    .post(async (req, res) => {
      const { email, password } = req.body;
      const user = await getUser(email);
      if (!user[0]?.email) {
        return res
          .status(404)
          .json({message: 'Email address not found!'}); 
      }

      const verifyPassword = bcrypt.compareSync(password, user[0]?.password)
      if (!verifyPassword) {
        return res
          .status(404)
          .json({message: 'Incorrect password!'}); 
      }

      const env = dotenv.config().parsed;
      const jwtSecret = env.JWT_SECRET;
      // const jwtSecret = process.env.JWT_SECRET;
      const { sign } = pkg;
      const jwToken = sign({
          id: user[0].id,
          email: user[0].email,
          password: user[0].password
        },
        jwtSecret
      )
      return res
        .setHeader('content-type', 'application/json')
        .status(200)
        .json({
          message: 'Welcome back!',
          token: jwToken,
          email: user[0].email,
          role: user[0].role,
          uniqueStoreId: user[0].uniqueStoreId,
        })
    })
    
// product routes --------------------------------------------------------------

app
  .route('/api/products')
    .get(async (req, res) => {
      const products = await getProducts()
      const sortedProducts = [...products].sort((a , b) => a.id < b.id ? 1 : -1);
      res
        .setHeader('content-type', 'application/json')
        .status(200)
        .json(sortedProducts)
    })

app
  .route('/api/store/:storeid/products')
    .get(async (req, res) => {
      const storeProducts = await getStoreProducts(req.params.storeid);
      if (storeProducts.length === 0) {
        return res
          .status(400)
          .json({message: 'Store not found'})
      }
      res
      .setHeader('content-type', 'application/json')
      .status(200)
      .json(storeProducts)
    })
    .post(async (req, res) => {
      if (req.body.role !== 'admin') {
        return res
          .status(400)
          .json({message: 'You do not have permission to add this product'})
      }
      await postNewProduct(req.params.storeid, req.body)
      const products = await getProducts()
      const sortedProducts = [...products].sort((a , b) => a.id < b.id ? 1 : -1);
      res
        .setHeader('content-type', 'application/json')
        .status(200)
        .json(sortedProducts)
    })

app
  .route('/api/store/:storeid/products/:id')
    .patch(async (req, res) => {
      if (req.body.role !== 'admin') {
        return res
          .status(400)
          .json({message: 'You do not have permission to update this product'})
      }
      const product = await getProduct(req.params.id);
      if (!product) {
        return res
          .status(400)
          .json({message: 'product not found'})
      }
      const products = await updateProductDetail(req.params.storeid, req.params.id, req.body);
      const sortedProducts = [...products].sort((a , b) => a.id < b.id ? 1 : -1);
      res
        .setHeader('content-type', 'application/json')
        .status(200)
        .json(sortedProducts)
    })
    .delete(async (req, res) => {
      const product = await getProduct(req.params.id);
      if (!product) {
        return res
          .status(400)
          .json({message: 'product not found'})
      }
      await deleteProduct(req.params.storeid, req.params.id)
      const products = await getProducts()
      const sortedProducts = [...products].sort((a , b) => a.id < b.id ? 1 : -1);
      res
        .setHeader('content-type', 'application/json')
        .status(200)
        .json(sortedProducts)
    });

// store routes ----------------------------------------------------------------

app
  .route('/api/store')
    .get(async (req, res) => {
      const stores = await getStores();
      const sortedStores = [...stores].sort((a , b) => a.uniqueStoreId > b.uniqueStoreId ? 1 : -1);
      res
        .setHeader('content-type', 'application/json')
        .status(200)
        .json(sortedStores)
    })



export default app;