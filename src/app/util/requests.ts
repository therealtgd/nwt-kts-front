import { HttpClient, HttpHeaders } from "@angular/common/http";

export const apiUrl = 'http://localhost:8080';
const header = {headers: new HttpHeaders({ 'Content-Type' : 'application/json', responseType : 'json' })}

export function get(httpClient: HttpClient, url: string){
  return httpClient.get(apiUrl + url, header);
}

export function post(httpClient: HttpClient, url: string, requestData : Object){
  return httpClient.post(apiUrl + url, requestData, header);
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
