import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface DialogData {
  email: string;
  name: string;
  userid?:string;
}
@Component({
  selector: 'app-dailog',
  templateUrl: './dailog.component.html',
  styleUrls: ['./dailog.component.css']
})
export class DailogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:DialogData,
    private fb :FormBuilder
    ) { }
    formData = this.fb.group({
      name : ['',Validators.required],
      email : ['',[Validators.required,Validators.email]]
    });
  ngOnInit(): void {
    
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
