import dotenv from 'dotenv';
import bunyan from 'bunyan';
import cloudinary from 'cloudinary';
import { string } from 'joi';
import Logger from 'bunyan';

dotenv.config({});

const logger: Logger = bunyan.createLogger({ name: 'API' });
class Config {
  public PORT_SER: string | undefined;
  public BASE_PATH_VERSION: string | undefined;
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;
  public REDIS_HOST: string | undefined;
  public CLOUD_NAME: string | undefined;
  public CLOUD_API_KEY: string | undefined;
  public CLOUD_API_SECRET: string | undefined;
  public SENDER_EMAIL: string | undefined;
  public SENDER_EMAIL_PASSWORD: string | undefined;
  public SENDGRID_API_KEY: string | undefined;
  public SENDGRID_SENDER: string | undefined;
  public EC2_URL: string | undefined;
  private readonly DEFAULT_DATABASE_URL = 'mongodb://0.0.0.0:27017/one-a';

  constructor() {
    this.PORT_SER = process.env.PORT_SER || '';
    this.BASE_PATH_VERSION = process.env.PORT_SER || '';
    this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DATABASE_URL;
    this.JWT_TOKEN = process.env.JWT_TOKEN || '1234';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.CLOUD_NAME = process.env.CLOUD_NAME || '';
    this.CLOUD_API_KEY = process.env.CLOUD_API_KEY || '';
    this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || '';
    this.SENDER_EMAIL = process.env.SENDER_EMAIL || '';
    this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || '';
    this.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
    this.SENDGRID_SENDER = process.env.SENDGRID_SENDER || '';
    this.EC2_URL = process.env.EC2_URL || '';
  }
  public validateConfig(): void {
    // for (const ele of Object.entries(this)){
    //   console.log(ele);

    // }
    for (const [key, value] of Object.entries(this)) {
      // console.log(this)
      // console.log(Object.entries(this))
      //console.log(`KEY:${key},VALUE:${value}`)
      //const x= Object.entries(this)
      //const [key,value]=x;
      //console.log(key);
      if (value === undefined) {
        throw new Error(`Configuration ${key} is undefined.`);
      }
    }
  }
  public createLogger(name: string) {
    return bunyan.createLogger({
      name,
      level: 'debug',
      streams: [
        { level: 'info', stream: process.stdout },
        {
          path: './api.log'
        }
      ]
    });
  }
  public cloudinaryConfig(): void {}
}

export const config: Config = new Config();

export const configObj = {
  DEFAULT_DATABASE_URL: 'mongodb://0.0.0.0:27017/one-a',
  PORT_SER: process.env.PORT_SER || '',
  BASE_PATH_VERSION: process.env.PORT_SER || '',
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://0.0.0.0:27017/one-a',
  JWT_TOKEN: process.env.JWT_TOKEN || '1234',
  NODE_ENV: process.env.NODE_ENV || '',
  SECRET_KEY_ONE: process.env.SECRET_KEY_ONE || '',
  SECRET_KEY_TWO: process.env.SECRET_KEY_TWO || '',
  CLIENT_URL: process.env.CLIENT_URL || '',
  REDIS_HOST: process.env.REDIS_HOST || '',
  CLOUD_NAME: process.env.CLOUD_NAME || '',
  CLOUD_API_KEY: process.env.CLOUD_API_KEY || '',
  CLOUD_API_SECRET: process.env.CLOUD_API_SECRET || '',
  SENDER_EMAIL: process.env.SENDER_EMAIL || '',
  SENDER_EMAIL_PASSWORD: process.env.SENDER_EMAIL_PASSWORD || '',
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  SENDGRID_SENDER: process.env.SENDGRID_SENDER || '',
  EC2_URL: process.env.EC2_URL || ''
};

class APILogger {
  info(msg: any) {
    logger.info(`API:${msg}`);
  }
  debug(msg: any, data: any) {
    logger.info(`API:${msg} | Details: ${JSON.stringify(data)}`);
  }
  error(msg: any) {
    logger.info(`API ERROR:${msg}`);
  }
}
