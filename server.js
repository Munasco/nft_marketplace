// File: your-backend-server.js
const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");

app.use(cors()); // Enable CORS for all routes

app.get("/getNFT/:hash", async (req, res) => {
  const hash = req.params.hash;
  try {
    const response = await axios.get(
      `https://amethyst-tremendous-turtle-55.mypinata.cloud/ipfs/${hash}`,
      {
        headers: {
          "x-pinata-gateway-token":
            "fQVbJOxWqESifpXpjvlk68ig1m8BHQ_cfNQEBi54vmDcjFNHzjM7Pab8Fonp-LHB",
        },
        responseType: "arraybuffer",
      }
    );
    const imageBase64 = `data:image/jpeg;base64,${Buffer.from(
      response.data,
      "binary"
    ).toString("base64")}`;
    res.send({ image: imageBase64 });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

app.listen(3001, () => {
  console.log("Your backend server is running on port 3001");
});
