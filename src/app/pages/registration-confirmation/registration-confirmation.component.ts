import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/app/services/ClientService';

@Component({
  selector: 'app-registration-confirmation',
  templateUrl: './registration-confirmation.component.html',
  styleUrls: ['./registration-confirmation.component.css']
})
export class RegistrationConfirmationComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService
    ){
    this.route.params.subscribe( params => clientService.activateClient({ "token": params['token'] })
    .subscribe( 
      data => { this.displayModal("Success!", data); },
      error => { this.displayModal("Oops!", error.error); this.redirect(); }
      ) );
  }

  modalVisibility: boolean = false;
  modalContent: string = '';
  modalHeader: string = '';

  redirect(pageName: string = ''){
    this.router.navigate([`${pageName}`]);
  }
  displayModal(header : string, content : Object) {
    this.modalContent = content.toString();
    this.modalHeader = header;
    this.modalVisibility = true;
  }
}
