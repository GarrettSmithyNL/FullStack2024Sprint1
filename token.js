// list of required modules
global.DEBUG = false;
const fs = require('fs');
const crypto = require('crypto');
const readline = require('readline');
const {format, addYears} = require('date-fns');

// constants 
const creationDate = `${format(new Date(), 'yyyyMMdd HH:mm:ss')}`;
// gave the expiry date a 10 year expiry
const expiryDate = format(addYears(new Date(), 10), 'yyyyMMdd HH:mm:ss'); 

const myArgs = process.argv.slice(2);


// Functions ----------------------------------------------------------------------------------------------------------

// used the built in cryto module to generate a random token
function generateToken() {
  return crypto.randomBytes(16).toString('hex');
}

// this block of code shuffles the characters of a string, i wanted this to make a more unique username,
// this is used in the newToken function and it converts the string into an array of characters, then shuffles the array
function shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join(''); 
}

// this function creates a new token and saves it to a file named tokens, will create if no file exists
// example node PO --new John Doe john_abc@hotmail.com
function newToken() {
    if(DEBUG) console.log('token.newToken()');
    const firstName = myArgs[2];
    const lastName = myArgs[3];
    const email = myArgs[4];

    // Prevents creating a token without required fields, entering nothing after --new will also cause the error to display
    if (!firstName || !lastName || !email) {
        console.error('Error: Missing required fields. First name, last name, and email are required. enter as John Smith example@123.com');
        return;
    }

    // Generate a username by shuffling a mix of firstName and lastName, as seen in the above defined shufflestring function
    const mixedName = firstName + lastName;
    const username = shuffleString(mixedName); 


    let newToken = JSON.parse(JSON.stringify({
        "username": username,
        "email": `${email}`,
        "token": generateToken(),
        "created": creationDate,
        "expires": expiryDate,
        "confirmed": "tbd"
    }));
    fs.appendFile('tokens', JSON.stringify(newToken) + '\n', (error) => {
        if (error) throw error;
        console.log('Token saved to file.');
    });
    
    return newToken;
}

// function to list all the tokens in the tokens file
  function listTokens() {
    if(DEBUG) console.log('token.listTokens()');
    fs.readFile('tokens', 'utf8', (error, data) => {
        if (error) throw error;
        const tokens = data.split('\n').filter(Boolean);
        tokens.forEach((token, index) => {
            console.log(`Token ${index + 1}: ${token}`);
        });
    });
  }


// function to delete a token with a given index example node PO --delete 1, and has a confirmation prompt
// that will display the token that the user has selected
function deleteToken() {
if(DEBUG) console.log('token.deleteToken()');
const tokenToDeleteIndex = myArgs[2] - 1; // Adjust for zero-based index
fs.readFile('tokens', 'utf8', (error, data) => {
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


  
  // main function that will run the token application
function tokenApp() {
    if(DEBUG) console.log('tokenApplication()');
    
    switch (myArgs[1]) {
    case '--count':
    case '--c':
        if(DEBUG) console.log('--count');
        break;
    case '--list':
    case '--l':
        if(DEBUG) console.log('--list');
        listTokens();
        break; 
    case '--new':
    case '--n':
        if(DEBUG) console.log('--new');
        newToken(myArgs[2]);
        break;
    case '--delete':
    case '--d':
        if(DEBUG) console.log('--delete');
        deleteToken(myArgs[2]);
        break;
    case '--help':
    case '--h':
    default:
        console.log('invalid syntax. node PO --help')
    }
}

module.exports = {
    tokenApp
};