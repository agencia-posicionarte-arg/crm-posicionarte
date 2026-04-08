const b = require('bcryptjs');
const h = b.hashSync('test1234', 10);
const ok = b.compareSync('test1234', h);
console.log('Hash valido:', ok);
console.log('');
console.log(`UPDATE "User" SET password = '${h}' WHERE email = 'santiagodambrosio2@gmail.com';`);
