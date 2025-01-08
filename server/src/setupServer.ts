/* eslint-disable @typescript-eslint/no-unused-vars */
import { Server } from 'socket.io';
import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieSession from 'cookie-session';
import Logger from 'bunyan';
import 'express-async-errors';
import http from 'http';
import hpp from 'hpp';
import { HttpRes } from './shared/globals/helpers/http-res';
import { config } from './config';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { MainRoute } from './routes';
import HSC from 'http-status-codes';
import { CustomError, NotFoundError, TErrorRes } from './shared/globals/helpers/error/error-handler';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SERVER_PORT = 5000;
const log: Logger = config.createLogger('server');
export class ServerX {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }
  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.apiMonitoring(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }
  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: 'session',
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 24 * 7 * 3600000,
        secure: config.NODE_ENV !== 'development'
      })
    );
    app.use(hpp());
    app.use(helmet());
    //     app.use( (req:Request, res:Response, next:NextFunction) {

    //   if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
    //     return res.sendStatus(204);
    //   }

    //  next();

    // });
    app.use(
      cors({
        origin: '*',
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );
  }
  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }
  private routesMiddleware(app: Application): void {
    MainRoute(app);

    // app.all('*',(req:Request,res:Response)=>{HttpRes.NOT_FOUND(res,`${HSC.NOT_FOUND} url:${req.url} ${HSC.getStatusText(HSC.NOT_FOUND)}`)});

    //   app.use("/", (req:Request, res:Response) => {
    //   //  console.log(req.baseUrl)
    //   //  console.log(req.headers)

    //   HttpRes.OK(res, `Home   :${req.originalUrl}, ${req}`,{request:req.headers});
    //   // res.status(200).json({message: `Home:${req.originalUrl} ,${req.headers}`})
    // });
    // app.use("/qwerty", async(req:Request, res:Response) => {
    //   console.log(req.url)
    //   HttpRes.OK(res, `QWERTY:${req.url},${req}`);
    // });

    // app.use("/test", async (req: Request, res: Response):Promise<void> => {
    //   console.log(req)
    //   HttpRes.CREATED(res, { message: "hello", OS: req });
    // });
    // app.use("/test1", async(req: Request, res: Response):Promise<void> => {
    //   // HttpRes.OK(res,"created",{IP:req.ip,URL:req.baseUrl,url2:req.url,url3:req.originalUrl})
    //   // HttpRes.CREATED(res,{info:req.headers,USER_AGENT:req.headers['user-agent'],COOKIES:req.headers['cookie'] ? req.headers['cookie'] : "No Cookies" ,COOKIE_SESSION:req.headers['cookie-session']})
    //   // HttpRes.ACCEPTED(res)
    //   HttpRes.CREATED(res, { sss: "ss", request: req.headers }, "HELLO");
    // });
  }
  private apiMonitoring(app: Application): void {}
  private globalErrorHandler(app: Application) {
    app.all('*', (req: Request, res: Response) => {
      HttpRes.NOT_FOUND(res, `${HSC.NOT_FOUND} url:${req.url} ${HSC.getStatusText(HSC.NOT_FOUND)}`);
      // throw new NotFoundError(`${HSC.NOT_FOUND} url:${req.url} ${HSC.getStatusText(HSC.NOT_FOUND)}`);

    });

    app.use((err: Error | TErrorRes, req: Request, res: Response, next: NextFunction) => {
      // console.log(err);
      log.error(err);
      if (err instanceof CustomError) {
        log.error(err);
        HttpRes.RES_WITH_DATA(res, err.statusCode, err.serializeErrors());
      } else if (err instanceof Error || typeof Error) {
        log.error(err);

        HttpRes.RES_WITH_DATA(res, 500, { statusCode: 500, status: 'fail', message: 'Server Error', error: err });
      } else {
        next();
      }
    });
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIO: Server = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
      this.socketIoConnection(socketIO);
    } catch (error) {
      // console.log(error);
      log.error(error);
      throw new Error(`startServer error: ${error}`);
    }
  }
  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });
    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }
  private startHttpServer(httpServer: http.Server): void {
    // console.log(`Server has started with process #${process.pid}`);
    log.info(`Server has started with process #${process.pid}`);
    httpServer.listen(config.PORT_SER, () =>
      // console.log(`Server running on port:${config.PORT_SER}`)
      log.info(`Server running on port:${config.PORT_SER}`)
    );
  }
  private socketIoConnection(io: Server): void {}
}
