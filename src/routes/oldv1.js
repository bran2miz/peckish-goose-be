// "use strict";

// const express = require("express");
// const dataModules = require("../models");
// // const yelp = require('yelp-fusion');
/
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