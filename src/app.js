import express from 'express';
import { getUsers, getUser, postNewUser, deleteUser,
  getProducts, getProduct, postNewProduct, deleteProduct,
  getStores, getStore, postNewStore, deleteStore } from './mongodb.js';
// import pkg from 'jsonwebtoken';
import cors from "cors";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()) 

// user routes -----------------------------------------------------------------

app
  .route('/api/user')
    .get(async (req, res) => {
      const users = await getUsers()
      // const sortedUsers = [...users].sort((a , b) => a.id < b.id ? 1 : -1);
      return res
        .setHeader('content-type', 'application/json')
        .status(200)
        .json(users)
    })
    .post(async (req, res) => {
      await postNewUser(req.body)
      const newUser = await getUser(req.body.email)
      res
        .setHeader('content-type', 'application/json')
        .status(200)
        .json(newUser)
    })
    .delete(async (req, res) => {
      await deleteUser(req.body.email)
      const users = await getUsers()
      res
        .setHeader('content-type', 'application/json')
        .status(200)
        .json(users)
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
    .post(async (req, res) => {
      await postNewProduct(req.body)
      const product = await getProduct(req.body.id, req.body.storeId)
      res
        .setHeader('content-type', 'application/json')
        .status(200)
        .json(product)
    })
    .delete(async (req, res) => {
      await deleteProduct(req.body.id, req.body.storeId)
      const products = await getProducts()
      res
        .setHeader('content-type', 'application/json')
        .status(200)
        .json(products)
    })

// store routes ----------------------------------------------------------------

app
  .route('/api/store')
    .get(async (req, res) => {
      const stores = await getStores()
      const sortedStores = [...stores].sort((a , b) => a.uniqueStoreId < b.uniqueStoreId ? 1 : -1);
      res
        .setHeader('content-type', 'application/json')
        .status(200)
        .json(sortedStores)
    })
    .post(async (req, res) => {
      await postNewStore(req.body)
      const newStore = await getStore(req.body.uniqueStoreId)
      res
        .setHeader('content-type', 'application/json')
        .status(200)
        .json(newStore)
    })
    .delete(async (req, res) => {
      await deleteStore(req.body.uniqueStoreId)
      const stores = await getStores()
      res
        .setHeader('content-type', 'application/json')
        .status(200)
        .json(stores)
    })

export default app;