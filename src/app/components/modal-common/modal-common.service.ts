import { STATE_MODAL } from './state.const';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalCommonService {
  listModal: any = {};
  idOpen = '';
  constructor() { }
  addModalItem(id: any) {
    const subjectListen = new BehaviorSubject({});
    const modal = { id, subjectListen, data: {} };
    if (this.listModal[id]) {
      alert('Trùng id rồi !' + id)
    }
    this.listModal[id] = modal;
    return modal.subjectListen;
  }
  removeModalItem(id: any) {
    delete this.listModal[id];
  }
  openModal(id: any, data?: any) {
    
    if (this.listModal[id]) {
      if (this.idOpen) {
        this.closeModal(this.idOpen);

      }
      this.idOpen = id;
      this.listModal[id].subjectListen.next({ type: STATE_MODAL.OPEN, data: data });
      
    } else {
      // alert('Không tồn tại !')
    }
  }
  closeModal(id: any) {
    if (this.listModal[id]) {
      this.listModal[id].subjectListen.next({ type: STATE_MODAL.CLOSE });
    }
  }

  getModalData(id: any) {
    if (this.listModal && this.listModal[id]) {
      return this.listModal[id].subjectListen;
    }
    return null;
  }
}
