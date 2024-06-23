const express = require('express');
const fs = require('fs');
const { configjson } = require('./templates.js');

const app = express();
const port = 3000;

app.use(express.json());

// Default config to reset to
const defaultConfig = {
  name: "AppConfigCLI",
  version: "1.0.0",
  description: "The Command Line Interface (CLI) for the MyApp.",
  main: "myapp.js",
  superuser: "adm1n",
  database: "exampledb",
};

// Route to view the config file
app.get('/config', (req, res) => {
  res.json(configjson);
});

// Route to update the config file
app.post('/config', (req, res) => {
  const newConfig = req.body;
  Object.assign(configjson, newConfig);
  fs.writeFileSync('./templates.js', `const configjson = ${JSON.stringify(configjson, null, 2)};\n\nmodule.exports = { configjson };`);
  res.json({ message: 'Config updated', config: configjson });
});

// Route to reset the config file
app.post('/config/reset', (req, res) => {
  Object.assign(configjson, defaultConfig);
  fs.writeFileSync('./templates.js', `const configjson = ${JSON.stringify(defaultConfig, null, 2)};\n\nmodule.exports = { configjson };`);
  res.json({ message: 'Config reset to default', config: configjson });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
