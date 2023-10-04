# Gaming World - Online game shop 

> eCommerce platform built with Vanilla Javascript and Sass, data stored in local storage, and data fetched from local db.json.

<img src="images/screenCapture.001.jpeg">

This project is part of my proof of concept. It is built by using JavaScript classes and local storage. See it in action at [Demo](https://kuladeepperumalla.github.io/Gaming-world---online-game-shop/)


## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Build Process](#build-process)
- [Developer](#Developer)





## Introduction

> Gaming World is an online game store for gaming enthusiasts.
- It has a beautiful landing page with auto slide of the latest games and a shop now button which takes to the game product cards
- All the product cards are fetched from a custom JSON file named games.json they are mapped and displayed using javascript template literals.

****

<p align="center">
  <img src = "images/Gaming_world_HomeScreen.gif" height=480 width=1060>
</p>



## Features

A few of the things you can do with Gaming world:

****
> Login
<p align="center">
  <img src = "images/login.gif" height=480 width=1060
    >
</p>

> Signup
<p align="center">
  <img src = "images/signup.gif" height=480 width=1060
    >
</p>

> Add to cart
<p align="center">
  <img src = "images/cart feature.gif" height=480 width=1060
    >
</p>

> Checkout
<p align="center">
  <img src = "images/home screen.gif" height=480 width=1060
    >
</p>

> Responsive layout
<p align="center">
  <img src = "images/mobile.gif" height=400 width=600
    >
</p>



## Build Process

## Usage

- Create a MongoDB database and obtain your `MongoDB URI` - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
- Create a PayPal account and obtain your `Client ID` - [PayPal Developer](https://developer.paypal.com/)

### Env Variables

Rename the `.env.example` file to `.env` and add the following

```
NODE_ENV = development
PORT = 5000
MONGO_URI = your mongodb uri
JWT_SECRET = 'abc123'
PAYPAL_CLIENT_ID = your paypal client id
PAGINATION_LIMIT = 8
```

Change the JWT_SECRET and PAGINATION_LIMIT to what you want

### Install Dependencies (frontend & backend)

```
npm install
cd frontend
npm install
```

### Run

```

# Run frontend (:3000) & backend (:5000)
npm run dev

# Run backend only
npm run server
```

## Build & Deploy

```
# Create frontend prod build
cd frontend
npm run build
```

### Seed Database

You can use the following commands to seed the database with some sample users and products as well as destroy all data

```
# Import data
npm run data:import

# Destroy data
npm run data:destroy
```

```
Sample User Logins

admin@email.com (Admin)
123456

john@email.com (Customer)
123456

jane@email.com (Customer)
123456
```

---


## Developer

This project is brought to you by  [Kuladeep Perumalla](https://github.com/kuladeepperumalla)).

