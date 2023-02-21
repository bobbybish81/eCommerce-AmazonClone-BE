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
  const existingUsers = await users.find().toArray();
  return existingUsers;
};

export const getUser = async (email) => {
  await connectUsers();
  const user = await users.find({email: email}).toArray();
  return user;
};

export const postNewUser = async (reqBody) => {
  await connectUsers();
  const existingUsers = await getUsers()
  const sortedUsers = [...existingUsers].sort((a , b) => a.id < b.id ? 1 : -1);

  const newUserId = sortedUsers[0].id + 1;
  const newUser = {
    id: newUserId,
    email: reqBody.email,
    password: reqBody.password,
    role: reqBody.role,
    uniqueStoreId: reqBody.uniqueStoreId
  }
  await users.insertOne(newUser)
};

export const deleteUser = async (email) => {
  await connectUsers();
  await users.deleteOne({email: email});
};


// product functions ----------------------------------------------------------------------------

export const getProducts = async () => {
  await connectProducts();
  const productList = await products.find().toArray();
  return productList;
};

export const getProduct = async (id) => {
  await connectProducts();
  const product = await products.find({id: parseInt(id)}).toArray();
  return product[0];
};

export const getStoreProducts = async (storeId) => {
  await connectProducts();
  const productList = await products.find({storeId: parseInt(storeId)}).toArray();
  return productList;
};

export const updateProductDetail = async (storeId, id, reqBody) => {
  await connectProducts();
  await products.updateOne(
    {
      id: parseInt(id),
      storeId: parseInt(storeId),
    },
    {
      $set: {
        price: reqBody.price,
        quantity: reqBody.quantity,
      },
    },
  );
  const productList = await products.find().toArray();
  return productList;
};

export const postNewProduct = async (storeId, reqBody) => {
  await connectProducts();
  const productList = await getProducts()
  const sortedProducts = [...productList].sort((a , b) => a.id < b.id ? 1 : -1);

  const newProductId = sortedProducts[0].id + 1;
  const newProduct = reqBody;
  newProduct.id = newProductId;
  newProduct.storeId = parseInt(storeId);
  await products.insertOne(newProduct)
};

export const deleteProduct = async (storeId ,id) => {
  await connectProducts();
  await products.deleteOne({storeId: parseInt(storeId), id: parseInt(id)});
};


// store functions ------------------------------------------------------------------------------

export const getStores = async () => {
  await connectStores();
  const storeList = await stores.find().toArray();
  return storeList;
};

export default { 
  getUsers,
  getUser,
  postNewUser,
  deleteUser,
  getProducts,
  getStoreProducts,
  postNewProduct,
  updateProductDetail,
  deleteProduct,
  getStores,
}; 