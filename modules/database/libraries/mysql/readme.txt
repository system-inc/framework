https://github.com/felixge/node-mysql

To create a standalone version of the mysql NPM module:

1. npm install -g browserify
2. npm install mysql
3. cd node_modules/mysql
4. browserify -s mysql index.js --bare -o mysql.js
5. Move the newly created mysql.js into this folder