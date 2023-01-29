import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from 'src/app/models/api-response';
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
  ) {
    this.route.params.subscribe(params =>
      clientService.activateClient({ "token": params['token'] })
        .subscribe({
          next: (response) => this.handleRegistrationSuccess(response),
          error: (error) => this.handleRegistrationError(error)
        }));
  }

  successModalVisibility: boolean = false;
  failureModalVisibility: boolean = false;
  modalContent: string = '';
  modalHeader: string = '';

  redirect(pageName: string = '') {
    this.router.navigate([`${pageName}`]);
  }
  handleRegistrationSuccess(response: ApiResponse<null>) {
    this.displaySuccessModal("Success!", response.message);
  }
  handleRegistrationError(error: ApiResponse<null>) {
    this.displayFailureModal("Oops!", error.message);
  }
  displaySuccessModal(header: string, content: Object) {
    this.modalContent = content.toString();
    this.modalHeader = header;
    this.successModalVisibility = true;
  }
  displayFailureModal(header: string, content: Object) {
    this.modalContent = content.toString();
    this.modalHeader = header;
    this.failureModalVisibility = true;
  }
}
