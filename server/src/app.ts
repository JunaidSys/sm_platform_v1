import { config } from './config';
import { connect_db } from './setupDB';
import { ServerX } from './setupServer';
import express, { Application, Express } from 'express';
class App {
  public initialize(): void {
    this.loadConfig();
    connect_db();
    const app: Express = express();
    const server: ServerX = new ServerX(app);
    server.start();
  }
  private loadConfig(): void {
    config.validateConfig();
  }
}

const application: App = new App();
application.initialize();
