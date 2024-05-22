const express = require('express');
const db = require('./config/db')
const route = require('./routes')
const bodyParser = require('body-parser')
const cors = require('cors');
const http = require('http');
require('dotenv').config()



db.connect()

const app = express();
const server = http.createServer(app);
const io = require('./socket')(server);


app.use(cors());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);


route(app)

// app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
//   console.log(error);
// });

server.listen(4001, () => {
  console.log('Listenning on port 4001');
});


module.exports = io;