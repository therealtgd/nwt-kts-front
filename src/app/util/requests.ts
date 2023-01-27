import { HttpClient, HttpHeaders } from "@angular/common/http";

export const apiUrl = 'http://localhost:8080';

export function get(httpClient: HttpClient, url: string, contentType: string = 'application/json'){
  return httpClient.get(apiUrl + url, getHeader(contentType));
}

export function post(httpClient: HttpClient, url: string, requestData : Object, contentType: string = 'application/json'){
  return httpClient.post(apiUrl + url, requestData, {});
}

export function put(httpClient: HttpClient, url: string, requestData : Object, contentType: string = 'application/json'){
  return httpClient.put(apiUrl + url, requestData, getHeader(contentType));
}

export function patch(httpClient: HttpClient, url: string, requestData : Object, contentType: string = 'application/json'){
  return httpClient.patch(apiUrl + url, requestData, getHeader(contentType));
}

export function del(httpClient: HttpClient, url : string, contentType: string = 'application/json'){
  return httpClient.delete(apiUrl + url, getHeader(contentType));
}

function getHeader(contentType: string) {
  return {headers: new HttpHeaders({ 'Content-Type' : contentType, responseType : 'json' })};
}
