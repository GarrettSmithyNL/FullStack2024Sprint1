const myArgs = process.argv.slice(2);

let addUser = () => {};

let removeUser = () => {};

let updateUser = () => {};

let userController = () => {
  switch (myArgs[1]) {
    case "add":
      addUser();
      break;
    case "remove":
      removeUser();
      break;
    case "update":
      updateUser();
      break;
  }
};

module.exports.userController = userController;
