import mongoose from 'mongoose';
import { config } from './config';
import Logger from 'bunyan';
const options = {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   useCreateIndex: true,
  //   useFindAndModify: false,
  //   autoIndex: false,
  //   poolSize: 10,
  //   bufferMaxEntries: 0,
  //   connectTimeoutMS: 0,
  //   socketTimeoutMS: 0,
  //   family: 4
};
const log: Logger = config.createLogger('database');

export const connect_db = () => {
  function db() {
    mongoose
      .connect(`${config.DATABASE_URL}`, options)
      .then(() => {
        // console.log(`Successfully connected to DB ${config.DATABASE_URL}`)
        log.info(`Successfully connected to DB ${config.DATABASE_URL}`);
      })
      .catch((err) => {
        // console.log(`Error connecting to DB: ${err}`);
        log.error(`Error connecting to DB: ${err}`);
        return process.exit(1);
      });
  }
  db();
  mongoose.connection.on('Disconnected', db);
};
