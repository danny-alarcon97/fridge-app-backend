// Controllers for the Item Collection

import "dotenv/config";
import express from "express";
import * as items from "./items-model.mjs";

const PORT = process.env.PORT;
const app = express();
app.use(express.json()); // REST needs JSON MIME type.

// CREATE controller ******************************************
app.post("/items", (req, res) => {
  items
    .createItem(
      req.body.name,
      req.body.brand,
      req.body.purchaseDate,
      req.body.expireDate,
      req.body.price,
      req.body.compartment,
      req.body.amountOf
    )
    .then((item) => {
      console.log(
        `"${item.name}" (${item.amountOf}) was added to the ${item.compartment} of your kitchen.`
      );
      res.status(201).json(item);
    })
    .catch((error) => {
      console.error(`Failed to add item. Error details: ${error}`);
      res.status(400).json({
        Error: `Failed to add item. Ensure that the provided data is correct and complete. Error details: ${error}`,
      });
    });
});

// RETRIEVE controller ****************************************************
app.get("/items", (req, res) => {
  items
    .retrieveItems()
    .then((items) => {
      if (items.length > 0) {
        console.log("Retrieved all items successfully.");
        res.json(items); // Send the array directly
      } else {
        console.log("No Items found in the collection.");
        res.status(404).json({ error: "No Items found." });
      }
    })
    .catch((error) => {
      console.error(`Error retrieving items: ${error}`);
      res.status(500).json({
        error: `Failed to retrieve items from the collection. Error details: ${error}`,
      });
    });
});

// RETRIEVE by ID controller
app.get("/items/:_id", (req, res) => {
  items
    .retrieveItemByID(req.params._id)
    .then((item) => {
      if (item) {
        console.log(`Successfully retrieved '${item.name}'.`);
        res.json(item); // Send the item object directly
      } else {
        console.log(
          `Item with ID [${req.params._id}] not found in the kitchen.`
        );
        res
          .status(404)
          .json({ error: `Item with ID [${req.params._id}] not found.` });
      }
    })
    .catch((error) => {
      console.error(
        `Failed to retrieve item with ID [${req.params._id}]. Error details: ${error}`
      );
      res
        .status(400)
        .json({ error: `Failed to retrieve item. Error details: ${error}` });
    });
});

// UPDATE controller ************************************
app.put("/items/:_id", (req, res) => {
  items
    .updateItem(
      req.body.name,
      req.body.brand,
      req.body.purchaseDate,
      req.body.expireDate,
      req.body.price,
      req.body.compartment,
      req.body.amountOf
    )
    .then((item) => {
      console.log(`The item '${item.name}' details were successfully updated.`);
      res.json({
        item: item,
        message: `The item '${item.name}' details were successfully updated.`,
      });
    })
    .catch((error) => {
      console.error(
        `Failed to update item with ID [${req.params._id}]. Error details: ${error}`
      );
      res.status(400).json({
        error: `Failed to update item with ID [${req.params._id}]. Ensure the provided data is valid. Error details: ${error}`,
      });
    });
});

// DELETE Controller ******************************
app.delete("/items/:_id", (req, res) => {
  items
    .deleteItemById(req.params._id)
    .then((deletedCount) => {
      if (deletedCount === 1) {
        console.log(`Based on its ID, ${deletedCount} item was deleted.`);
        res.status(200).send({
          Success: `The item with ID [${req.params._id}] was successfully deleted from your kitchen.`,
        });
      } else {
        res.status(404).json({
          Error: `No item found with ID [${req.params._id}] to delete.`,
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.send({
        Error: `No item found with ID [${req.params._id}] to delete.`,
      });
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
