import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

type HeaderT = {
  headers: HttpHeaders,
}

export const apiUrl = 'http://localhost:8080';
const header: HeaderT = {headers: new HttpHeaders({ 'Content-Type' : 'application/json', responseType : 'json' })}

export function get(httpClient: HttpClient, url: string, contentType: string = 'application/json'){
  return httpClient.get(apiUrl + url, getHeader(contentType));
}

export function getWithParams(httpClient: HttpClient, url: string, params: HttpParams){
  return httpClient.get(apiUrl + url, {...header, params});
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
