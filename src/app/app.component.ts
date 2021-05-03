import { Component,Inject, OnInit } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { MatDialogRef,MatDialog,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from "@angular/material/button";
import {DialogModuleComponent} from './dialog-module/dialog-module.component';
import {BackendApiService } from './services/backend-api.service';
import {OperationService} from './services/operation.service';
export interface DataNode {
  id:number;
  name: string;
  children?: DataNode[];
  type?:string;
  parent_id?:number;
}
export interface DialogData {
  name: string;
  isFile: boolean;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'front-end';
  treeControl = new NestedTreeControl<DataNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<DataNode>();

  constructor(public dialog: MatDialog,private BackendApiService: BackendApiService,private service:OperationService) {
    
  }
  ngOnInit() {
    this.refreshTreeData();
 
  }
  refreshTreeData() {
    this.BackendApiService.get().subscribe((data:any)=>{
      if(data.result){
        this.dataSource.data = data.result;
      }
    });
    const data = this.dataSource.data;
    this.dataSource.data = null;
    this.dataSource.data = data;
  }
  openCustomDialog(currentNode:any): void {
   
    const dialogRef = this.dialog.open(DialogModuleComponent, {
      width: '41%',height:'41%',
      data: {node: currentNode}
    });
    dialogRef.afterClosed().subscribe(result => {
      let temp:any ={
        id:null,
        name:result.data.name,
        children:[]
      }
      let node:DataNode = temp;
      node.id = result.data.id; 
      if(result.data.isFile == false){
        node.type = 'dir';
        const fatherElement: any = this.service.findFatherNode(currentNode.id, this.dataSource.data);
        if(fatherElement[0]){
          fatherElement[0].children.push(node);
          this.refreshTreeData();
        }
      }else{
        node.type = 'file';
        currentNode.children.push(node);
        this.refreshTreeData();
      }
    });
  }
  deleteNode(nodeToBeDeleted: DataNode) { 
    const deletedElement: any = this.service.findFatherNode(nodeToBeDeleted.id, this.dataSource.data);
    let elementPosition: number;
    if (window.confirm('Are you sure you want to delete ' + nodeToBeDeleted.name + '?' )) {
        this.BackendApiService.delete(nodeToBeDeleted.id).subscribe((result:any)=>{
          if(result){
            if (deletedElement[0]) {
              deletedElement[0].children.splice(deletedElement[1], 1);
            } else {
              elementPosition = this.service.findPosition(nodeToBeDeleted.id, this.dataSource.data);
              this.dataSource.data.splice(elementPosition, 1);
          }
          this.refreshTreeData(); 
          }
        });
    }
  }

  hasChild = (_: number, node: DataNode) => !!node.children && node.children.length > 0;
}
