import { Injectable } from '@angular/core';
import { DataNode } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  flatJsonArray(flattenedAray: Array<DataNode>, node: DataNode[]) {
    const array: Array<DataNode> = flattenedAray;
    node.forEach(element => {
      if (element.children) {
        array.push(element);
        this.flatJsonArray(array, element.children);
      }
    });
    return array;
  }

  findPosition(id: number, data: DataNode[]):any {
    for (let i = 0; i < data.length; i += 1) {
      if (id === data[i].id) {
        return i;
      }
    }
  }

  findFatherNode(id: number, data: DataNode[]):any {
    for (let i = 0; i < data.length; i += 1) {
      const currentFather = data[i];
      if(currentFather.children !== undefined){
        for (let z = 0; z < currentFather.children.length; z += 1) {
          if (id === currentFather.children[z]['id']) {
            return [currentFather, z];
          }
        }
        for (let z = 0; z < currentFather.children.length; z += 1) {
          if (id !== currentFather.children[z]['id']) {
            const result = this.findFatherNode(id, currentFather.children);
            if (result !== false) {
              return result;
            }
          }
        }
      }else{
        return false;
      }
    }
    return false;
  }

}