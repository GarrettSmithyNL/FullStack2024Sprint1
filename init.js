const myArgs = process.argv.slice(2);
const fs = require('fs');
function checkAppInit() {
    switch (myArgs[0]) {
        case "init":
        case "i":
          if (fs.existsSync('./PO.js')) {
            console.log('Init has been run previously');
          } else {
            console.log('Init has not been run yet');
          }
          break;
      }
};



module.exports = {
    checkAppInit
};