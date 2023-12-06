import {Request, Response} from '@loopback/rest';
import {JwtPayload, decode} from 'jsonwebtoken';

export interface IHttpResponseData {
  statusCode?: number,
  message?: string,
  data?: {},
  request?: Request,
  response?: Response,
}

export interface IHttpResponse {
  statusCode?: number,
  message?: string,
  data?: IData | any,
}

interface IData {
  total?: number,
  result?: any[],
  page?: number,
}

const getLogData = (data?: IHttpResponseData) => {
  return {
    module: data?.request?.query?.module,
    route: data?.request?.url,
    statusCode: data?.statusCode,
    statusMessage: data?.message,
    userId: getUserId(data?.request?.headers?.authorization),
    timestamp: new Date(),
    verb: data?.request?.method,
    requestBody: data?.request?.body || {},
    ip: data?.request?.ip,
  };
};

const getUserId = (token?: string) => {
  if(!token) return null;
  const jwtPayload = decode(token.split(' ')[1]) as JwtPayload;
  return jwtPayload?.id;
}

/**
 * Return a ok http response
 * @param httpResponseData
 * @returns object with status code, data and message
 */
export const okHttpResponse = (
  httpResponseData?: IHttpResponseData,
): IHttpResponse => {
  if (httpResponseData?.request) {
    console.info(JSON.stringify(
      getLogData({...httpResponseData, statusCode: 200})
    ));
  }

  httpResponseData?.response?.status(200);
  return {
    statusCode: httpResponseData?.statusCode ?? 200,
    data: httpResponseData?.data,
    message: httpResponseData?.message ?? 'Ok response successfully',
  };
};

/**
 * Return a create http response
 * @param httpResponseData
 * @returns object with status code and message
 */
export const createHttpResponse = (
  httpResponseData?: IHttpResponseData,
): IHttpResponse => {
  if (httpResponseData?.request) {
    console.info(JSON.stringify(
      getLogData({...httpResponseData, statusCode: 201})
    ));
  }

  httpResponseData?.response?.status(201);
  return {
    statusCode: httpResponseData?.statusCode ?? 201,
    data: httpResponseData?.data,
    message: httpResponseData?.message ?? 'Create successfully',
  };
};

/**
 * Return a no content http response
 * @param httpResponseData
 * @returns object with status code and message
 */
export const noContentHttpResponse = (
  httpResponseData?: IHttpResponseData,
): IHttpResponse => {
  if (httpResponseData?.request) {
    console.info(JSON.stringify(
      getLogData({...httpResponseData, statusCode: 204})
    ));
  }

  httpResponseData?.response?.status(204);
  return {
    statusCode: httpResponseData?.statusCode ?? 204,
    data: httpResponseData?.data,
    message: httpResponseData?.message ?? 'No content response',
  };
};

/**
 * Return a bad request http response
 * @param httpResponseData
 * @returns object with status code and message
 */
export const badRequestErrorHttpResponse = (
  httpResponseData?: IHttpResponseData,
): IHttpResponse => {
  if (httpResponseData?.request) {
    console.error(JSON.stringify({
      ...getLogData({...httpResponseData, statusCode: 400}),
      exceptionMessage: httpResponseData.message,
    }));
  }

  httpResponseData?.response?.status(400);
  return {
    statusCode: httpResponseData?.statusCode ?? 400,
    data: httpResponseData?.data,
    message: httpResponseData?.message,
  };
};

/**
 * Return a unauthorized http response error
 * @param httpResponseData
 * @returns object with status code and message
 */
export const unauthorizedErrorHttpResponse = (
  httpResponseData?: IHttpResponseData,
): IHttpResponse => {
  if (httpResponseData?.request) {
    console.error(JSON.stringify({
      ...getLogData({...httpResponseData, statusCode: 401}),
      exceptionMessage: httpResponseData.message,
    }));
  }

  httpResponseData?.response?.status(401);
  return {
    statusCode: httpResponseData?.statusCode ?? 401,
    data: httpResponseData?.data,
    message: httpResponseData?.message,
  };
};

/**
 * Return a not found http response error
 * @param httpResponseData
 * @returns object with status code and message
 */
export const notFoundErrorHttpResponse = (
  httpResponseData?: IHttpResponseData,
): IHttpResponse => {
  if (httpResponseData?.request) {
    console.error(JSON.stringify({
      ...getLogData({...httpResponseData, statusCode: 404}),
      exceptionMessage: httpResponseData.message,
    }));
  }

  httpResponseData?.response?.status(404);
  return {
    statusCode: httpResponseData?.statusCode ?? 404,
    data: httpResponseData?.data,
    message: httpResponseData?.message,
  };
};

/**
 * Return a entity validation http response error
 * @param httpResponseData
 * @returns object with status code and message
 */
export const unprocessableEntityErrorHttpResponse = (
  httpResponseData?: IHttpResponseData,
): IHttpResponse => {
  if (httpResponseData?.request) {
    console.error(JSON.stringify({
      ...getLogData({...httpResponseData, statusCode: 422}),
      exceptionMessage: httpResponseData.message,
    }));
  }

  httpResponseData?.response?.status(422);
  return {
    statusCode: httpResponseData?.statusCode ?? 422,
    data: httpResponseData?.data,
    message: httpResponseData?.message,
  };
};

/**
 * Return a Forbidden http response error
 * @param httpResponseData
 * @returns object with status code and message
 */
export const forbiddenErrorHttpResponse = (
  httpResponseData?: IHttpResponseData,
): IHttpResponse => {
  if (httpResponseData?.request) {
    console.error(JSON.stringify({
      ...getLogData({...httpResponseData, statusCode: 403}),
      exceptionMessage: httpResponseData.message,
    }));
  }

  httpResponseData?.response?.status(403);
  return {
    statusCode: httpResponseData?.statusCode ?? 403,
    data: httpResponseData?.data,
    message: httpResponseData?.message,
  };
};

/**
 * Return a internal server http response error
 * @param httpResponseData
 * @returns object with status code and message
 */
export const internalServerErrorHttpResponse = (
  httpResponseData?: IHttpResponseData,
): IHttpResponse => {
  if (httpResponseData?.request) {
    console.error(JSON.stringify({
      ...getLogData({...httpResponseData, statusCode: 500}),
      exceptionMessage: httpResponseData.message,
    }));
  }

  httpResponseData?.response?.status(500);
  return {
    statusCode: httpResponseData?.statusCode ?? 500,
    data: httpResponseData?.data,
    message: httpResponseData?.message,
  };
};
