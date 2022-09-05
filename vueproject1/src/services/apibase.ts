import global from './global';
import { StateValue, ApiResult } from './models';
import utils from './utils';

const apiBaseUrl: string = process.env.VUE_APP_ROOT_API;
const timeout: number = 20;

// duck typing check result is ApiResult
function isApiResult(result: any) {
  return ("State" in result) && ("Error" in result) && "Value" in result;
}

// ensure response is ok
function checkResponse(response: Response): Promise<any> {
  if (!response.ok) {
    throw `${response.status} ${response.statusText} (${response.url})`;
  }

  return response.json();
}

// ensure result is ok
function checkResult<Result>(json: any) {
  if (!isApiResult(json)) {
    return json as Result;
  }

  const result = json as ApiResult<Result>;

  if (result.State !== StateValue.Ok) {
    throw result.Error;
  }

  return result.Value;
}

// fetch GET
function GET<Result>(path: string): Promise<Result> {
  global.showBlocker();

  return utils.delay(timeout).then(() => {
    // query data
    return fetch(`${apiBaseUrl}${path}`, { credentials: 'include' });
  }).then(response => {
    return checkResponse(response);
  }).then(json => {
    return checkResult<Result>(json);
  }).finally(() => global.hideBlocker());
}

// fetch POST
function POST<Payload, Result>(path: string, payload: Payload): Promise<Result> {
  global.showBlocker();

  return utils.delay(timeout).then(() => {
    // post data
    // if fetch failed remove "headers: { 'Content-Type': 'application/json' }"
    return fetch(`${apiBaseUrl}${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify(payload) });
  }).then(response => {
    return checkResponse(response);
  }).then(json => {
    return checkResult<Result>(json);
  }).finally(() => global.hideBlocker());
}

// fetch PATCH
function PATCH<Payload, Result>(path: string, payload: Payload): Promise<Result> {
  global.showBlocker();

  return utils.delay(timeout).then(() => {
    // post data
    // if fetch failed remove "headers: { 'Content-Type': 'application/json' }"
    return fetch(`${apiBaseUrl}${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json' }, method: 'PATCH', body: JSON.stringify(payload) });
  }).then(response => {
    return checkResponse(response);
  }).then(json => {
    return checkResult<Result>(json);
  }).finally(() => global.hideBlocker());
}

// fetch DELETE
function DELETE(path: string): Promise<void> {
  global.showBlocker();

  return utils.delay(timeout).then(() => {
    // query data
    return fetch(`${apiBaseUrl}${path}`, { credentials: 'include', method: 'DELETE' });
  }).then(response => {
    return checkResponse(response);
  }).finally(() => global.hideBlocker());
}

export default {
  GET,
  POST,
  PATCH,
  DELETE,
}
