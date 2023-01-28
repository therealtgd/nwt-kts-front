import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from 'src/app/dto/api-response';
import { ClientService } from 'src/app/services/client.service';

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
    .subscribe({ 
      next: (response) => this.handleRegistrationSuccess(response as ApiResponse),
      error: (error) => this.handleRegistrationError(error)
      }) );
  }

  successModalVisibility: boolean = false;
  errorModalVisibility: boolean = false;
  modalContent: string = '';
  modalHeader: string = '';

  redirect(pageName: string = ''){
    this.router.navigate([`${pageName}`]);
  }
  handleRegistrationSuccess(response: ApiResponse) {
    this.displaySuccessModal("Success!", response.message);
  }
  handleRegistrationError(error: HttpErrorResponse) {
    this.displayErrorModal("Oops!", error.error);
  }
  displaySuccessModal(header : string, content : Object) {
    this.modalContent = content.toString();
    this.modalHeader = header;
    this.successModalVisibility = true;
  }
  displayErrorModal(header : string, content : Object) {
    this.modalContent = content.toString();
    this.modalHeader = header;
    this.errorModalVisibility = true;
  }
}
