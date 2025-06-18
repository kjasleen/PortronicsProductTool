// hash-password.js
import bcrypt from 'bcrypt';


const password = 'admin@P0rtr0nics';
const saltRounds = 10;

bcrypt.hash(password, saltRounds).then((hash) => {
  console.log('Hashed password:', hash);
});
