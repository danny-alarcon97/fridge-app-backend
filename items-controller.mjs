// Controllers for the Manga Collection

import "dotenv/config";
import express from "express";
import * as mangas from "./mangas-model.mjs";

const PORT = process.env.PORT;
const app = express();
app.use(express.json()); // REST needs JSON MIME type.

// CREATE controller ******************************************
app.post("/mangas", (req, res) => {
  mangas
    .createManga(
      req.body.title,
      req.body.volume,
      req.body.author,
      req.body.released,
      req.body.language
    )
    .then((manga) => {
      console.log(
        `"${manga.title}" volume: ${manga.volume} by ${manga.author} was added to the collection.`
      );
      res.status(201).json(manga);
    })
    .catch((error) => {
      console.error(`Failed to add manga. Error details: ${error}`);
      res.status(400).json({
        Error: `Failed to add manga. Ensure that the provided data is correct and complete. Error details: ${error}`,
      });
    });
});

// RETRIEVE controller ****************************************************
app.get("/mangas", (req, res) => {
  mangas
    .retrieveMangas()
    .then((mangas) => {
      if (mangas.length > 0) {
        console.log("Retrieved all mangas successfully.");
        res.json(mangas); // Send the array directly
      } else {
        console.log("No Mangas found in the collection.");
        res.status(404).json({ error: "No Mangas found." });
      }
    })
    .catch((error) => {
      console.error(`Error retrieving mangas: ${error}`);
      res.status(500).json({
        error: `Failed to retrieve mangas from the collection. Error details: ${error}`,
      });
    });
});

// RETRIEVE by ID controller
app.get("/mangas/:_id", (req, res) => {
  mangas
    .retrieveMangaByID(req.params._id)
    .then((manga) => {
      if (manga) {
        console.log(
          `Successfully retrieved '${manga.title}' (volume ${manga.volume}).`
        );
        res.json(manga); // Send the manga object directly
      } else {
        console.log(
          `Manga with ID [${req.params._id}] not found in the collection.`
        );
        res
          .status(404)
          .json({ error: `Manga with ID [${req.params._id}] not found.` });
      }
    })
    .catch((error) => {
      console.error(
        `Failed to retrieve manga with ID [${req.params._id}]. Error details: ${error}`
      );
      res
        .status(400)
        .json({ error: `Failed to retrieve manga. Error details: ${error}` });
    });
});

// UPDATE controller ************************************
app.put("/mangas/:_id", (req, res) => {
  mangas
    .updateManga(
      req.params._id,
      req.body.title,
      req.body.volume,
      req.body.author,
      req.body.released,
      req.body.language
    )
    .then((manga) => {
      console.log(
        `The manga '${manga.title}' (volume ${manga.volume}) was successfully updated.`
      );
      res.json({
        manga: manga,
        message: `The manga '${manga.title}' (volume ${manga.volume}) was successfully updated.`,
      });
    })
    .catch((error) => {
      console.error(
        `Failed to update manga with ID [${req.params._id}]. Error details: ${error}`
      );
      res.status(400).json({
        error: `Failed to update manga with ID [${req.params._id}]. Ensure the provided data is valid. Error details: ${error}`,
      });
    });
});

// DELETE Controller ******************************
app.delete("/mangas/:_id", (req, res) => {
  mangas
    .deleteMangaById(req.params._id)
    .then((deletedCount) => {
      if (deletedCount === 1) {
        console.log(`Based on its ID, ${deletedCount} manga was deleted.`);
        res.status(200).send({
          Success: `The manga with ID [${req.params._id}] was successfully deleted from the collection.`,
        });
      } else {
        res.status(404).json({
          Error: `No manga found with ID [${req.params._id}] to delete.`,
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.send({
        Error: `No manga found with ID [${req.params._id}] to delete.`,
      });
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
