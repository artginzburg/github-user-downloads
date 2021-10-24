const { endpoint } = require('./endpoint');

const { PORT = 3000 } = process.env;

endpoint.listen(PORT, () => {
  console.log(`Endpoint listening on http://localhost:${PORT}`);
});
