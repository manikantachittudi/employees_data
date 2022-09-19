import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Database, ref, remove} from "@angular/fire/database";
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private db:HttpClient,private dataBase:Database){
  }
  url = environment.firebase.databaseURL + `/Employees.json/`;
  addData(data:any):Observable<any>{
    return this.db.post(this.url,data)
  }
  getData():Observable<any>{
    return this.db.get(this.url)
  }
  updateData(data:any):Observable<any>{
    return this.db.patch(this.url,data)
  }
  deleteData(data:any){
   remove(ref(this.dataBase,`Employees/${data}`))
  }
}