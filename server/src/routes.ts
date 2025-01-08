/* eslint-disable @typescript-eslint/no-unused-vars */
import { Application, Request, Response } from 'express';
import { HttpRes } from './shared/globals/helpers/http-res';

export const MainRoute = (app: Application) => {
  (() => {
    app.get('/', (req:Request, res:Response) => {
      console.log(req.baseUrl);
      HttpRes.OK(res, `Home:${req.originalUrl}`,{reqHeader:req.headers});
    });
    app.use('/qwerty', (req, res) => {
        console.log(req.url);
      HttpRes.OK(res, `QWERTY:${req.baseUrl}`);
    });

    app.use('/test', async (req: Request, res: Response) => {
        console.log(req);
      HttpRes.CREATED(res, { message: 'hello', OS: req });
    });
    app.use('/test1', async(req: Request, res: Response) => {
      // HttpRes.OK(res,"created",{IP:req.ip,URL:req.baseUrl,url2:req.url,url3:req.originalUrl})
      // HttpRes.CREATED(res,{info:req.headers,USER_AGENT:req.headers['user-agent'],COOKIES:req.headers['cookie'] ? req.headers['cookie'] : "No Cookies" ,COOKIE_SESSION:req.headers['cookie-session']})
      // HttpRes.ACCEPTED(res)
      HttpRes.CREATED(res, { sss: 'ss', request: req.headers }, 'HELLO');
    });
  })();
//   const route=()=>{

//        app.get('/', (req:Request, res:Response) => {
//       console.log(req.baseUrl);
//       // console.log(req)
//       HttpRes.OK(res, `Home Page:${req.originalUrl},REQ:${req.headers}`);
//     });
//            app.get('/1', (req:Request, res:Response) => {
//     console.log(HttpRes.test());
//       HttpRes.OK(res, `1 Page:${req.originalUrl}`,{req_headers:req.headers});
//     });
//         app.get('/error', (req, res) => {
//   throw new Error('Something went wrong');
// });
//   };
//   route();
};
