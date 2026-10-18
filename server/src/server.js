const app = require('./app');
const env = require('./config/env');

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Haramaya FindIt API running on http://localhost:${PORT}`);
});
