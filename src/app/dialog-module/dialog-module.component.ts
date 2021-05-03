import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DataNode} from '../app.component'
import {BackendApiService} from '../services/backend-api.service';

@Component({
  selector: 'app-dialog-module',
  templateUrl: './dialog-module.component.html',
  styleUrls: ['./dialog-module.component.css']
})

export class DialogModuleComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DialogModuleComponent>,@Inject(MAT_DIALOG_DATA) public data:any,private service:BackendApiService) { }
  DialogData:any={
    name:'',
    isFile:false,
    file:{
      name:'',
      file:File
    },
    parent_id:null,
    id:null,
  };
  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close({data:this.DialogData});
  }
  submit():void{
    this.DialogData.parent_id = this.data.node.id;  
    this.service.update(this.DialogData).subscribe(result => {
      console.log(result);
        if (result) {
          this.DialogData.id = result.id;
          this.dialogRef.close({data:this.DialogData})
        }
      },
      (error:any) => {

      },
      () => {

      }
  );
  }
  onFileChange(event:any) {
    this.DialogData.file.file = event.target.files[0];
    this.DialogData.file.name = event.target.files[0].name;
    console.log(this.DialogData);
  }

}
