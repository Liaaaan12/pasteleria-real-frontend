// Augment Axios config to allow custom flag used by our interceptors
import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    // When true, 401 responses won't trigger login redirect in interceptor
    skipAuthRedirect?: boolean;
  }
}
