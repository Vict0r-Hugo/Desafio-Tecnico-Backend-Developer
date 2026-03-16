const axios = require("axios");
const retry = require("../utils/retry");

async function notifyProtheus(data) {

  return retry(async () => {

    const response = await axios.post(
      "https://mock-protheus/api/inventory",
      data
    );

    if (response.status >= 500) {
      throw new Error("Protheus API error");
    }

    return response.data;

  }, 3);

}

module.exports = { notifyProtheus };