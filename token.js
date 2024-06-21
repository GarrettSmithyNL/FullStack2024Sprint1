// list of required modules
global.DEBUG = false;
const fs = require('fs');
const crc32 = require('crc/crc32');
const readline = require('readline');
const {format, addDays} = require('date-fns');

const myArgs = process.argv.slice(2);


// Functions ----------------------------------------------------------------------------------------------------------

function generateToken(username) {
    newToken.token = crc32(username).toString(8);
    const expiryDate = format(addDays(new Date(), 3), 'yyyyMMdd HH:mm:ss'); 
    let baseToken = crc32(username).toString(8);
    let now = new Date();
    let timestamp = format(now, 'yyyy-MM-dd HH:mm:ss');
    let expires = expiryDate // Adds 3 days to the current date
    return `${baseToken}-${timestamp}-expires:${expires}`;
}



// function to list all the tokens in the tokens file
  function listTokens() {
    if(DEBUG) console.log('token.listTokens()');
    fs.readFile('/tokens/tokens.json', 'utf8', (error, data) => {
        if (error) throw error;
        const tokens = data.split('\n').filter(Boolean);
        tokens.forEach((token, index) => {
            console.log(`Token ${index + 1}: ${token}`);
            
        });
    });
  };


// function to delete a token with a given index example node PO --delete 1, and has a confirmation prompt
// that will display the token that the user has selected
function deleteToken() {
if(DEBUG) console.log('token.deleteToken()');
const tokenToDeleteIndex = myArgs[2] - 1; // Adjust for zero-based index
fs.readFile('/tokens/tokens.json', 'utf8', (error, data) => {
    if (error) throw error;
    const tokens = data.split('\n').filter(Boolean);
    if (tokenToDeleteIndex >= tokens.length || tokenToDeleteIndex < 0) {
        console.error('Error: Token does not exist.');
        return;
    }
    const tokenToDelete = tokens[tokenToDeleteIndex];
    console.log(`Token to delete: ${tokenToDelete}`);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Are you sure you want to delete this token? (y/n) ', (answer) => {
        if (answer.toLowerCase() === 'y') {
            tokens.splice(tokenToDeleteIndex, 1);
            fs.writeFile('tokens', tokens.join('\n'), (error) => {
                if (error) throw error;
                console.log('Token deleted.');
            });
        } else {
            console.log('Token deletion cancelled.');
        }
        rl.close();
    });
});
}

module.exports = {
    generateToken,
    listTokens,
    deleteToken,
};