const axios = require("axios");
const fs = require("fs");
axios
  .get(
    "https://amethyst-tremendous-turtle-55.mypinata.cloud/ipfs/QmaCBeTkAxF5689tGN1xk4HQ11Dw9J5sD1xc1sfJfZABFg",
    {
      headers: {
        "x-pinata-gateway-token":
          "fQVbJOxWqESifpXpjvlk68ig1m8BHQ_cfNQEBi54vmDcjFNHzjM7Pab8Fonp-LHB",
      },
      responseType: "arraybuffer",
    }
  )
  .then((response) => {
    const json = response.data;
    console.log(json);

    // Assuming `data` is your binary data
    let data = json;

    // Write binary data to a file
    fs.writeFile("output.jpg", data, "binary", (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("File saved successfully!");
    });
  })
  .catch((error) => {
    console.log(error);
  });
