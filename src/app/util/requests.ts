import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

type HeaderT = {
  headers: HttpHeaders,
}

export const apiUrl = 'http://localhost:8080';
const header: HeaderT = {headers: new HttpHeaders({ 'Content-Type' : 'application/json', responseType : 'json' })}

export function get(httpClient: HttpClient, url: string){
  return httpClient.get(apiUrl + url, header);
}

export function getWithParams(httpClient: HttpClient, url: string, params: HttpParams){
  return httpClient.get(apiUrl + url, {...header, params});
}

export function post(httpClient: HttpClient, url: string, requestData : Object){
  return httpClient.post(apiUrl + url, requestData, header);
}

export function postWithoutHeader(httpClient: HttpClient, url: string, requestData : Object){
  return httpClient.post(apiUrl + url, requestData, {});
}

export function put(httpClient: HttpClient, url: string, requestData : Object){
  return httpClient.put(apiUrl + url, requestData, header);
}

export function patch(httpClient: HttpClient, url: string, requestData : Object){
  return httpClient.patch(apiUrl + url, requestData, header);
}

export function del(httpClient: HttpClient, url : string){
  return httpClient.delete(apiUrl + url, header);
}
