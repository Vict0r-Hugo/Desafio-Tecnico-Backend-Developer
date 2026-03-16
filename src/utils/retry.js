async function retry(fn, retries = 3, delay = 1000) {

  try {
    return await fn();
  } catch (error) {

    if (retries === 0) {
      throw error;
    }

    console.log("Retrying...", retries);

    await new Promise(r => setTimeout(r, delay));

    return retry(fn, retries - 1, delay);
  }

}

module.exports = retry;