
import { STATE_MODAL } from './state.const';
import { Subscription } from 'rxjs';
import { ModalCommonService } from './modal-common.service';
import { Component, OnInit, Input, OnDestroy, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { modalAnimation } from './modal.animation';

@Component({
  selector: 'app-modal-common',
  templateUrl: './modal-common.component.html',
  styleUrls: ['./modal-common.component.scss'],
  animations: [modalAnimation],
  standalone: true,
  imports: [
    CommonModule,
  ],
})
export class ModalCommonComponent implements OnInit, OnDestroy {
  @Input() id: any;
  @Input() clickOutsideClose = true;
  @Input() displayX = true;
  @Input() backgroundColor = '';
  @Input() backgroundModal = '';
  subcription = new Subscription();
  showModal = false;
  @Input() withHeader = false;
  @ContentChild(TemplateRef)
  templateRef?: TemplateRef<any>;
  constructor(private modalCommonService: ModalCommonService) { }

  ngOnInit(): void {
    this.subcription = this.modalCommonService.addModalItem(this.id).subscribe((data: any) => {
      if (data.type === STATE_MODAL.OPEN) {
        this.openModal();
      }
      if (data.type === STATE_MODAL.CLOSE) {
        this.closeModal();
      }
    });
  }
  openModal() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }
  clickOutside() {
    if (this.clickOutsideClose) {
      this.closeModal();
    }
  }
  ngOnDestroy() {
    this.modalCommonService.removeModalItem(this.id);
    this.subcription.unsubscribe();
  }

}
