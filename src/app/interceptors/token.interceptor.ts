// token.interceptor.ts
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  // Get the token from local storage
  const token = localStorage.getItem('authToken');

  // Clone the request to add the new header if token exists
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `JWT ${token}`,
        },
      })
    : req;

  // Pass the request to the next handler
  return next(authReq);
};
