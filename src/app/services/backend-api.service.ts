import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  
  constructor(private  http:HttpClient) { }
  update(data:any){
    const uploadData = new FormData();
    const apiURl = environment.APIEndpoint+'create';
    uploadData.append('name',data.name);
    uploadData.append('parent_id',data.parent_id);
    uploadData.append('file',data.file.file);
    uploadData.append('is_file',data.isFile);
    return this.http.post<any>(apiURl, uploadData);
  }
  get(){
    const apiURl = environment.APIEndpoint + 'index';
    return this.http.get(apiURl);
  }
  delete(id:number){
    const apiURl = environment.APIEndpoint+id+'/delete';
    return this.http.delete(apiURl);
  }
}
