const axios = require("axios");
const fs = require("fs");
axios
  .get(
    "https://amethyst-tremendous-turtle-55.mypinata.cloud/ipfs/Qmagetb9anpn3YhYW8cNoiWetPhNUmZAnHBWJ9vcwvNuGE",
    {
      headers: {
        "x-pinata-gateway-token":
          "_LL4RBT18RUyjIcJUFNMPLywVI7MlVkVtQJlKOeijHskzTNyYZjb5qiPDuN4_Egw",
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
