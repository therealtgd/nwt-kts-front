import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() visible: boolean = false;
  @Input() header: string = '';
  @Input() content: string = '';
  @Output() onModalClose: EventEmitter<any> = new EventEmitter(); 

  closeModal() {
    this.onModalClose.emit();
  }
}
