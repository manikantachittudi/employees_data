import { Component, OnInit } from '@angular/core';
import { Database, ref, remove} from "@angular/fire/database";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {AfterViewInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from '../services/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { DailogComponent } from './dailog/dailog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,AfterViewInit{
  displayedColumns:string[] = ['id','name','email','edit','delete'];
  dataSource: MatTableDataSource<any>;
  data:any[] = [];
  errormessage:any = "No data found....";

  @ViewChild(MatPaginator) paginator! : MatPaginator;
  @ViewChild(MatSort) sort! : MatSort;
  constructor(public dialog: MatDialog,private db : Database,private service : EmployeeService) {
   
    this.dataSource = new MatTableDataSource();
   }
   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.getData();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  deleteEmployee(data:any){
    remove(ref(this.db,`Employees/${data}`));
    this.dataSource.data = [];
    this.errormessage = "Deleting Employee........."
    setTimeout(() => {
      this.getData();
      this.errormessage = "No data found....";
    }, 1000);
  }
  getData(){
    this.dataSource.data = [];
    this.data = [];
    this.service.getData().subscribe({
      next:(d)=> {
        let flag:number = 1
      for(let i of Object.keys(d)){
          let id = i;
          let temp:any = {
          };
          temp.userid = id;
          temp.id = flag;
          temp.name = d[id].name;
          temp.email = d[id].email;
          this.data.push(temp);
          flag++;
        };
        this.dataSource.data = this.data;
      }
    });
  }
  addData(data:any){
    this.dataSource.data = [];
    this.service.addData(data).subscribe(() => {
      this.errormessage = "Adding data......"
      setTimeout(() => {
        this.getData();
      }, 2000);
    });
  }
  updateData(data:any){
    this.dataSource.data = [];
    this.errormessage = "Updating data......."
    this.service.updateData(data).subscribe(() => {
      setTimeout(() => {
        this.getData();
      }, 2000);
    });
  }





  // dailog section methods
  openDialog(da?:any): void {
    const dialogRef = this.dialog.open(DailogComponent, {
      width: '75%',
      data: da?da:{
        name:'',email:''
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      let sentData : any = {
      };
      if(!result){
        return
      }
      if(result.userid){
        sentData[result.userid] = {
          name : result.name,
          email : result.email
        }
        this.updateData(sentData);
      }
      else if(result.name == '' || result.email == ""){
        return
      }
      else{
        sentData.name = result.name;
        sentData.email = result.email;
        this.addData(sentData);
      }
    });
  }
}
