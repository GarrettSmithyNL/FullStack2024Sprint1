const express = require('express');
const { configjson } = require('./templates.js');

const app = express();
const port = 3000;

// Route to view the config file
app.get('/config', (req, res) => {
  res.json(configjson);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
