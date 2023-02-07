import { MongoClient } from 'mongodb';

const url = process.env.MONGO_URL;
const dbName = 'saltazonDatabase';

let client;
let users;
let products;
let stores;

const connectUsers = async () => {
  client = await MongoClient.connect(url, { useNewUrlParser: true }, { useUnifiedTopology: true });
  const db = client.db(dbName);
  users = db.collection('users');
};

const connectProducts = async () => {
  client = await MongoClient.connect(url, { useNewUrlParser: true }, { useUnifiedTopology: true });
  const db = client.db(dbName);
  products = db.collection('products');
};

const connectStores = async () => {
  client = await MongoClient.connect(url, { useNewUrlParser: true }, { useUnifiedTopology: true });
  const db = client.db(dbName);
  stores = db.collection('stores');
};


// user functions -------------------------------------------------------------------------------

export const getUsers = async () => {
  await connectUsers();
  const userList = await users.find().toArray();
  return userList;
};

export const getUser = async (email) => {
  await connectUsers();
  const user = await users.find({email: email}).toArray();
  return user;
};

export const postNewUser = async (newUser) => {
  await connectUsers();
  await users.insertOne(newUser)
};

export const deleteUser = async (email) => {
  try {
    await connectUsers();
    await users.deleteOne({email: email});
    } catch (e) {
    throw new Error(e.message);
  }
  
};


// product functions ----------------------------------------------------------------------------

export const getProducts = async () => {
  await connectProducts();
  const productList = await products.find().toArray();
  return productList;
};

export const getProduct = async (id, uniqueStoreId) => {
  await connectProducts();
  const product = await products.find({id: id, uniqueStoreId: uniqueStoreId}).toArray();
  return product;
};

export const postNewProduct = async (newProduct) => {
  await connectProducts();
  await products.insertOne(newProduct)
};

export const deleteProduct = async (id, storeId) => {
  try {
    await connectProducts();
    await products.deleteOne({id: id, storeId: storeId});
    } catch (e) {
    throw new Error(e.message);
  }
};


// store functions ------------------------------------------------------------------------------

export const getStores = async () => {
  await connectStores();
  const storeList = await stores.find().toArray();
  return storeList;
};

export const getStore = async (uniqueStoreId) => {
  await connectStores();
  const store = await stores.find({uniqueStoreId: uniqueStoreId}).toArray();
  return store;
};

export const postNewStore = async (newStore) => {
  await connectStores();
  await stores.insertOne(newStore)
};

export const deleteStore = async (uniqueStoreId) => {
  try {
    await connectStores();
    await stores.deleteOne({ uniqueStoreId });
    } catch (e) {
    throw new Error(e.message);
  }
};

export default { 
  getUsers,
  getUser,
  postNewUser,
  deleteUser,
  getProducts,
  getProduct,
  postNewProduct,
  deleteProduct,
  getStores,
  getStore,
  postNewStore,
  deleteStore,
}; 