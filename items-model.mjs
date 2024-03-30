// Models for the Item Collection

// Import dependencies.
import mongoose from "mongoose";
import "dotenv/config";

// Connect based on the .env file parameters.
mongoose.connect(process.env.MONGODB_CONNECT_STRING, { useNewUrlParser: true });
const db = mongoose.connection;

// To allow queries with paths not defined in the schema (prepares for Mongoose 7's default)
mongoose.set("strictQuery", false);

// Confirm that the database has connected and print a message in the console.
db.once("open", () => {
  console.log("MongoDB Database connected successfully.");
});

db.on("error", (error) => {
  console.error("MongoDB Database connection error:", error);
});

// SCHEMA: Define the collection's schema.
const itemSchema = mongoose.Schema({
  name: { type: String, required: true },
  itemType: { type: String, required: false },
  brand: { type: String, required: false },
  purchaseDate: { type: Date, required: false },
  expireDate: { type: Date, required: false },
  price: { type: Number, required: false },
  compartment: { type: String, required: true },
  amountOf: { type: Number, required: true },
});

// Compile the model from the schema
// by defining the collection name "Item".
const Item = mongoose.model("Item", itemSchema);

// CREATE model
const createItem = async (
  name,
  itemType,
  brand,
  purchaseDate,
  expireDate,
  price,
  compartment,
  amountOf
) => {
  try {
    const item = new Item({
      name,
      itemType,
      brand,
      purchaseDate,
      expireDate,
      price,
      compartment,
      amountOf,
    });
    return await item.save();
  } catch (error) {
    console.error("Create Item Error:", error);
    throw error;
  }
};

// RETRIEVE model
const retrieveItems = async () => {
  try {
    return await Item.find();
  } catch (error) {
    console.error("Retrieve Items Error:", error);
    throw error;
  }
};

// RETRIEVE by ID
const retrieveItemByID = async (_id) => {
  try {
    return await Item.findById(_id);
  } catch (error) {
    console.error("Retrieve Item by ID Error:", error);
    throw error;
  }
};

// UPDATE model
const updateItem = async (
  _id,
  name,
  itemType,
  brand,
  purchaseDate,
  expireDate,
  price,
  compartment,
  amountOf
) => {
  try {
    const result = await Item.findByIdAndUpdate(
      _id,
      {
        name,
        itemType,
        brand,
        purchaseDate,
        expireDate,
        price,
        compartment,
        amountOf,
      },
      { new: true }
    );
    return result;
  } catch (error) {
    console.error("Update Item Error:", error);
    throw error;
  }
};

// DELETE model
const deleteItemById = async (_id) => {
  try {
    const result = await Item.deleteOne({ _id });
    return result.deletedCount;
  } catch (error) {
    console.error("Delete Item Error:", error);
    throw error;
  }
};

// EXPORT the variables for use in the controller file.
export {
  createItem,
  retrieveItems,
  retrieveItemByID,
  updateItem,
  deleteItemById,
};
