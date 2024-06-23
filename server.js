const express = require('express');
const fs = require('fs');
const { configjson } = require('./templates.js');

const app = express();
const port = 3000;

app.use(express.json());

// Route to view the config file
app.get('/config', (req, res) => {
  res.json(configjson);
});

// Route to update the config file
app.post('/config', (req, res) => {
  const newConfig = req.body;
  // Update the config file with new data
  Object.assign(configjson, newConfig);
  fs.writeFileSync('./templates.js', `const configjson = ${JSON.stringify(configjson, null, 2)};\n\nmodule.exports = { configjson };`);
  res.json({ message: 'Config updated', config: configjson });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

