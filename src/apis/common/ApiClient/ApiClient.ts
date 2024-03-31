import type { HTTPMethod } from './ApiClient.type';

import { isErrorStatusCode } from './ApiClient.util';

class ApiClient {
  static ERROR_MESSAGES_MAP = {
    404: '서버가 요청 받은 리소스를 찾을 수 없습니다.',
    500: '서버 에러가 발생했습니다.',
  };

  constructor(private url: string, private httpMethod: HTTPMethod = 'GET') {
    this.url = url;
    this.httpMethod = httpMethod;
  }

  async request(): Promise<Response> {
    const response = await fetch(this.url, { method: this.httpMethod });

    this.handleProcessStatusCode(response);

    return response;
  }

  private handleProcessStatusCode(response: Response) {
    if (!isErrorStatusCode(response.status)) return;

    throw new Error(ApiClient.ERROR_MESSAGES_MAP[response.status]);
  }
}

export default ApiClient;
