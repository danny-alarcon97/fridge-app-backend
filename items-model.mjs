// Models for the Item Collection

// Import dependencies.
import mongoose from "mongoose";
import "dotenv/config";

// Connect based on the .env file parameters.
mongoose.connect(process.env.MONGODB_CONNECT_STRING, { useNewUrlParser: true });
const db = mongoose.connection;

// Confirm that the database has connected and print a message in the console.
db.once("open", () => {
  console.log("MongoDB Database connected successfully.");
});

db.on("error", (error) => {
  console.error("MongoDB Database connection error:", error);
});

// SCHEMA: Define the collection's schema.
const mangaSchema = mongoose.Schema({
  title: { type: String, required: true },
  volume: { type: Number, required: true },
  author: { type: String, required: true },
  released: { type: Date, required: true },
  language: { type: String, required: true },
});

// Compile the model from the schema
// by defining the collection name "Manga".
const Manga = mongoose.model("Manga", mangaSchema);

// CREATE model
const createManga = async (title, volume, author, released, language) => {
  try {
    const manga = new Manga({
      title,
      volume,
      author,
      released,
      language,
    });
    return await manga.save();
  } catch (error) {
    console.error("Create Manga Error:", error);
    throw error;
  }
};

// RETRIEVE model
const retrieveMangas = async () => {
  try {
    return await Manga.find();
  } catch (error) {
    console.error("Retrieve Mangas Error:", error);
    throw error;
  }
};

// RETRIEVE by ID
const retrieveMangaByID = async (_id) => {
  try {
    return await Manga.findById(_id);
  } catch (error) {
    console.error("Retrieve Manga by ID Error:", error);
    throw error;
  }
};

// UPDATE model
const updateManga = async (_id, title, volume, author, released, language) => {
  try {
    const result = await Manga.findByIdAndUpdate(
      _id,
      { title, volume, author, released, language },
      { new: true }
    );
    return result;
  } catch (error) {
    console.error("Update Manga Error:", error);
    throw error;
  }
};

// DELETE model
const deleteMangaById = async (_id) => {
  try {
    const result = await Manga.deleteOne({ _id });
    return result.deletedCount;
  } catch (error) {
    console.error("Delete Manga Error:", error);
    throw error;
  }
};

// EXPORT the variables for use in the controller file.
export {
  createManga,
  retrieveMangas,
  retrieveMangaByID,
  updateManga,
  deleteMangaById,
};
