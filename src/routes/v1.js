// "use strict";

// const express = require("express");
// const dataModules = require("../models");
// // const yelp = require('yelp-fusion');
// // const client = yelp.client('LBtr7AKSsCl4l_Mx_S7gSAEECv1brQpYejNcjbgMlfnRqvYuztUWSLhN42irwYuTVEqKU7rbHNa5vlqfwYgX6ztqT7Mzq9qdsvttLgxbDVE6QJjS164bBE_xNKVgYXYx')

// const v1Router = express.Router();

// // const moodToCategory = {
// //   tired: "healthyfood",
// //   sad: "desserts",
// //   adventurous: "indian",
// //   curious: "ethiopian",
// //   stressed: "comfortfood",
// //   relaxed: "italian",
// //   excited: "sushi",
// //   happy: "sushi",
// //   angry: "dinerfood"
// // };



// v1Router.param("model", (req, res, next) => {
//   const modelName = req.params.model;
//   if (dataModules[modelName]) {
//     req.model = dataModules[modelName].model || dataModules[modelName];  // Access the raw Sequelize model
//     // ie : If the model parameter is restaurants, req.model is set to restaurantsModel
//     next();
//   } else {
//     next('Invalid Model');
//   }
// });

// v1Router.get("/:model", handleGetAll);
// v1Router.get("/:model/:id", handleGetOne);
// v1Router.post("/:model", handleCreate);
// v1Router.put("/:model/:id", handleUpdate);
// v1Router.delete("/:model/:id", handleDelete);

// async function handleGetAll(req, res) {
//   try {
//     const options = buildIncludeOptions(req.model.name);
//     let allRecords = await req.model.findAll(options);
//     res.status(200).json(allRecords);
//   } catch (err) {
//     console.error('Error fetching records:', err);
//     res.status(500).json({ message: 'Error fetching records', error: err.message });
//   }
  
// }

// // async function handleGetAll(req, res) {
// //   const mood = req.query.mood;  // The mood comes from user input
// //   const category = moodToCategory[mood] || 'restaurants';  // Convert mood to Yelp category

// //   try {
// //     // Check if restaurants already exist in your DB
// //     const options = buildIncludeOptions(req.model.name);
// //     let restaurants = await req.model.findAll(options);

// //     // If no restaurants found in DB, use Yelp API
// //     if (restaurants.length === 0) {
// //       const yelpResponse = await client.search({
// //         term: category,
// //         location: 'Seattle',  // Customize based on user location
// //         categories: category,
// //         limit: 10,
// //       });

// //       // Parse Yelp response
// //       const yelpRestaurants = yelpResponse.jsonBody.businesses.map(business => ({
// //         name: business.name,
// //         description: business.categories[0]?.title || 'No description available',
// //         displayName: business.name,
// //         category,
// //       }));

// //       // Save Yelp restaurants to DB
// //       restaurants = await req.model.bulkCreate(yelpRestaurants, { returning: true });
// //     }

// //     // Send restaurants to the client
// //     res.status(200).json(restaurants);
// //   } catch (err) {
// //     console.error('Error fetching records:', err);
// //     res.status(500).json({ message: 'Error fetching records', error: err.message });
// //   }
// // }



// // find by the id 
// async function handleGetOne(req, res) {
//   // req.params: { model: 'restaurants', id: '1' }
//   const id = req.params.id;
//   try {
//     // find by primary key
//     const restaurant = await req.model.findByPk(id, {
//       include: [{ model: dataModules['menusModel'] }]
//     });
    
//     if (restaurant) {
//       res.status(200).json(restaurant);
//     } else {
//       res.status(404).json({ message: 'Restaurant not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching record', error: err.message });
//   }
// }


// function buildIncludeOptions(modelName) {
//   if (modelName === 'restaurantsModel') {
//     return { include: { model: dataModules['menusModel'] } };
//   }
// }

// async function handleCreate(req, res) {
//   let obj = req.body;
//   let newRecord = await req.model.create(obj);
//   res.status(201).json(newRecord);
// }

// async function handleUpdate(req, res) {
//   const id = req.params.id;
//   const obj = req.body;
//   let updatedRecord = await req.model.update(id, obj);
//   res.status(200).json(updatedRecord);
// }

// async function handleDelete(req, res) {
//   const id = req.params.id;
//   let deletedRecord = await req.model.destroy({ where: { id } });
//   res.status(200).json(deletedRecord);
// }

"use strict";

const express = require("express");
const dataModules = require("../models");
const yelp = require('yelp-fusion');
const client = yelp.client('LBtr7AKSsCl4l_Mx_S7gSAEECv1brQpYejNcjbgMlfnRqvYuztUWSLhN42irwYuTVEqKU7rbHNa5vlqfwYgX6ztqT7Mzq9qdsvttLgxbDVE6QJjS164bBE_xNKVgYXYx');

const v1Router = express.Router();

const moodToCategory = {
  tired: "healthy",
  sad: "desserts",
  adventurous: "indian",
  curious: "ethiopian",
  stressed: "comfort",
  relaxed: "italian",
  excited: "sushi",
  happy: "sushi",
  angry: "diner"
};

const axios = require('axios');


v1Router.get('/yelp', async (req, res) => {
  try {
    const yelpResponse = await axios.get('https://api.yelp.com/v3/businesses/search', {
      headers: {
        Authorization: `Bearer LBtr7AKSsCl4l_Mx_S7gSAEECv1brQpYejNcjbgMlfnRqvYuztUWSLhN42irwYuTVEqKU7rbHNa5vlqfwYgX6ztqT7Mzq9qdsvttLgxbDVE6QJjS164bBE_xNKVgYXYx`
      },
      params: {
        term: 'restaurants',
        location: 'Seattle',
        categories: req.query.category || 'restaurants',
      }
    });
    res.status(200).json(yelpResponse.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



v1Router.param("model", (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName].model || dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

v1Router.get("/:model", handleGetAll);
v1Router.get("/:model/:id", handleGetOne);
v1Router.get('/restaurants/:restaurantId/menus', handleGetMenusForRestaurant);
v1Router.post("/:model", handleCreate);
v1Router.post('/restaurants/:restaurantId/menus', handleMenuCreate);
v1Router.put("/:model/:id", handleUpdate);
v1Router.put('/restaurants/:restaurantId/menus/:id', handleMenuUpdate);
v1Router.delete("/:model/:id", handleDelete);
v1Router.delete('/restaurants/:restaurantId/menus/:id', handleMenuDelete);


// Main function to handle fetching from DB or Yelp API if not found
async function handleGetAll(req, res) {
  const mood = req.query.mood;  // User input for mood
  const category = moodToCategory[mood] || 'restaurants';  // Map mood to category

  try {
    // Check if restaurants already exist in your DB
    let restaurants = await req.model.findAll({
      include: [{ model: dataModules['menusModel'] }] // Include menus
    });

    // If no restaurants found, use Yelp API
    if (restaurants.length === 0) {
      const yelpResponse = await client.search({
        term: category,
        location: 'Seattle',  // Customize based on location
        categories: category,
        limit: 10,
      });

      const yelpRestaurants = yelpResponse.jsonBody.businesses.map(business => ({
        name: business.name,
        description: business.categories[0]?.title || 'No description available',
        displayName: business.name,
        category,
        imageUrl: business.image_url 
      }));

      // Save Yelp results to DB
      restaurants = await req.model.bulkCreate(yelpRestaurants, { returning: true });
    }

    res.status(200).json(restaurants);
  } catch (err) {
    console.error('Error fetching records:', err);
    res.status(500).json({ message: 'Error fetching records', error: err.message });
  }
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  try {
    const restaurant = await req.model.findByPk(id, {
      include: [{ model: dataModules['menusModel'] }]  // Include menus in get one
    });

    if (restaurant) {
      res.status(200).json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching record', error: err.message });
  }
}

async function handleGetMenusForRestaurant(req, res) {
  const { restaurantId } = req.params;

  try {
    const restaurant = await dataModules['restaurantsModel'].findByPk(restaurantId, {
      include: [{ model: dataModules['menusModel'] }]  // Include menus
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(restaurant.Menus);
  } catch (err) {
    console.error('Error fetching menus:', err);
    res.status(500).json({ error: 'Error fetching menus' });
  }
}

async function handleCreate(req, res) {
  const mood = req.body.mood;
  const category = moodToCategory[mood] || 'restaurants';  // Use the moodToCategory mapping

  try {
    // Yelp API call based on mood
    const yelpResponse = await client.search({
      term: category,
      location: 'Seattle',
      categories: category,
      limit: 10,
    });

    // Extract the necessary restaurant data from the Yelp API response
    const yelpRestaurants = yelpResponse.jsonBody.businesses.map(business => ({
      name: business.name,
      description: business.categories[0]?.title || 'No description available',
      displayName: business.name,
      category,
      imageUrl: business.image_url  // Include imageUrl in creation
    }));

    // Save the Yelp restaurant data to your DB using Sequelize
    const savedRestaurants = await req.model.bulkCreate(yelpRestaurants, { returning: true });

    // Return the saved restaurants as the response
    res.status(201).json(savedRestaurants);
  } catch (err) {
    console.error('Error creating restaurant data:', err);
    res.status(500).json({ error: 'Error creating restaurant data' });
  }
}


async function handleMenuCreate(req, res) {
  const { menuItems, restaurantId, menuName } = req.body;

  try {
    const restaurant = await dataModules['restaurantsModel'].findByPk(restaurantId);
    // console.log("find restaurant",restaurant)
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const newMenu = await dataModules['menusModel'].create({
      menuName,
      menuItems: menuItems, 
      restaurantId
    });
    console.log(newMenu);
    res.status(201).json(newMenu);
  } catch (err) {
    console.error('Error creating menu items:', err);
    res.status(500).json({ error: 'Error creating menu items' });
  }
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj);
  res.status(200).json(updatedRecord);
}

async function handleMenuUpdate(req, res) {
  const { id } = req.params;
  const updatedMenuData = req.body;

  try {
    const menuItem = await dataModules['menusModel'].findByPk(id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await menuItem.update(updatedMenuData);
    res.status(200).json(menuItem);
  } catch (err) {
    console.error('Error updating menu item:', err);
    res.status(500).json({ error: 'Error updating menu item' });
  }
}

async function handleDelete(req, res) {
  const id = req.params.id;
  let deletedRecord = await req.model.destroy({ where: { id } });
  res.status(200).json(deletedRecord);
}

async function handleMenuDelete(req, res) {
  const { id } = req.params;

  try {
    const menuItem = await dataModules['menusModel'].findByPk(id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await menuItem.destroy();
    res.status(200).json({ message: 'Menu item deleted' });
  } catch (err) {
    console.error('Error deleting menu item:', err);
    res.status(500).json({ error: 'Error deleting menu item' });
  }
}


module.exports = v1Router;

