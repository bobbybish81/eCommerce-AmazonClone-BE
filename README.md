# eCommerce-AmazonClone-BE
The backend of a e-commerce application

# Technologies
Javascript • 
Node JS • 
Express •
MongoDB •
bcrypt •
jsonwebtoken •
joi •
REST api architecture

# Getting Started
1. Clone this repository and run npm install
2. You will need create a database in mongoDB named 'saltazonDatabase' with the following collections:

  users {
    id:
    email:
    password:
    role:
    uniqueStoreId:
  }

  products {
    id:
    title:
    description:
    imageUrl:
    storeId:
    price:
    quantity:
    category:
  }
  
  stores {
    name:
    uniqueStoreId:
  }

id fields for users and products are only required to be entered manually on the first entry. Subsequent users/products will be assigned an id when created via the application.

Follow link below for assistance with creating mongoDB collections:
https://www.mongodb.com/cloud/atlas/lp/try4?utm_source=bing&utm_campaign=search_bs_pl_evergreen_atlas_core_prosp-brand_gic-null_emea-se_ps-all_desktop_eng_lead&utm_term=mongodbatlas&utm_medium=cpc_paid_search&utm_ad=p&utm_ad_campaign_id=415204557&adgroup=1207264237114064&msclkid=72240c86c5451ff8c2a66f663bfec6a8

1. Create an .env file and add your mongo url variable - e.g: MONGO_URL="mongodb+srv...... "
2. Add jsonwebtoken variable to .env file e.g. JWT_SECRET=secret

# Requirements

The app should have two different roles; Admin and User. 
User is the customer. A user can add products to their cart, save their cart in local storage, and have that only visible by them.
Admin can add, change and delete products for the store the are assigned to, as per their unique Store Id. A user cannot access the admin page where changes to products occur.

- Login page 
An error is thrown if the user’s password is incorrect or if the email doesn’t exist (“Email or password is incorrect”).
Signing a JWT Token and sending back in response.
{ token: “”, user: {email: “” ….} }
User is redirected to the Home page

- Sign-up page 
Email, Password, Type of user (store admin or user)
Email is validated to check if it has already been used by an existing user
Validation is done using joi to ensure password and email are entered in the correct format.
Password and confirmed password should match.
Bcrypt is used to encrypt the user's password before storing it in the database.

- Admin page
Changes to product information is carried out by the admin via the admin page. Requests are sent to the backend and the revised product list is sent to the frontend. Any chnages are then displayed on the page.

# Routes
POST /user/register - Add a new user
POST /user/login - Login a user
GET /api/products - Fetch all products
GET /api/store - Fetch all stores
GET /api/store/:storeid/products - Fetch all products for specifc store
POST /api/store/:storeid/products - Add new product for specifc store
PATCH /api/store/:storeid/products/:id - Update product detail
DELETE /api/store/:storeid/products/:id - Delete product

# Author
<h3>Robert Bish</h3>

<a href='https://www.linkedin.com/in/robert-bish-1a6a8637'>
  <img src='https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white' alt='LinkedIn Badge'/>
</a>
<a href='https://robertbishwebdeveloper.com'>
  <img src='https://img.shields.io/badge/Portfolio-darkgreen?style=for-the-badge&logo=portfolio&logoColor=white' alt='Portfolio Badge'/>
</a>
<a href='https://www.facebook.com/robert.bish.9'>
  <img src='https://img.shields.io/badge/Facebook-darkblue?style=for-the-badge&logo=facebook&logoColor=white' alt='Facebook Badge'/>
</a>
