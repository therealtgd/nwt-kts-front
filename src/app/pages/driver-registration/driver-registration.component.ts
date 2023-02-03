import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUpload } from 'primeng/fileupload';
import { DriverRegistrationRequest } from 'src/app/dto/driver-registration-request';
import { ApiResponse } from 'src/app/models/api-response';
import { DriverService } from 'src/app/services/driver/driver.service';
import { ConfirmPasswordValidator } from 'src/app/validators/confirm-password.validator';

@Component({
  selector: 'app-driver-registration',
  templateUrl: './driver-registration.component.html',
  styleUrls: ['./driver-registration.component.css']
})
export class DriverRegistrationComponent {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  vehicleTypes: string[] = ["SEDAN", "WAGON"];
  licencePlateRegex: RegExp = /^[^<>*!?\s\[\];'\\,./`+=]+$/;
  noSpecial: RegExp = /^[^<>*!0-9]+$/;
  successModalVisibility: boolean = false;
  failureModalVisibility: boolean = false;
  registrationForm!: FormGroup;
  modalContent: string = '';
  modalHeader: string = '';
  uploadedFile!: File;
  url: any;
  
  constructor(
    private fb: FormBuilder,
    private driverService: DriverService,
    private router: Router,
  ) { }

  
  async ngOnInit() {

    this.registrationForm = this.fb.group({
      displayName: [''],
      email: [''],
      username: [''],
      phoneNumber: [''],
      city: [''],
      capacity: [''],
      licencePlate: [''],
      vehicleType: ['SEDAN'],
      petsAllowed: [''],
      babiesAllowed: [''],
      password: [''],
      confirmPassword: ['', [Validators.required]],
    },
      {
        validator: ConfirmPasswordValidator("password", "confirmPassword")
      });
  }
  uploadFile(event: any) {
    for (let file of event.files) {
      this.uploadedFile = file
    }
    this.fileUpload.clear();
    this.showImage();
  }
  showImage() {
    if (this.uploadedFile === undefined) { return; }
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.url = event.target.result;
    };
    reader.onerror = (event: any) => {
      console.log("File could not be read: " + event.target.error.code);
    };
    reader.readAsDataURL(this.uploadedFile);
  }
  registerDriver(): void {
    let request: DriverRegistrationRequest = {
      displayName: this.registrationForm.value.displayName,
      email: this.registrationForm.value.email,
      username: this.registrationForm.value.username,
      phoneNumber: this.registrationForm.value.phoneNumber,
      city: this.registrationForm.value.city,
      password: this.registrationForm.value.password,
      confirmPassword: this.registrationForm.value.confirmPassword,
      imageUploaded: this.uploadedFile !== undefined,
      capacity: this.registrationForm.value.capacity,
      licencePlate: this.registrationForm.value.licencePlate,
      vehicleType: this.registrationForm.value.vehicleType,
      petsAllowed: this.registrationForm.value.petsAllowed,
      babiesAllowed: this.registrationForm.value.babiesAllowed
    };
    
    this.driverService.registerDriver(this.getRequestData(request))
      .subscribe({
        next: (data) => this.displaySuccessModal("Success!", "You have successfully registered a new driver."),
        error: (error) => this.displayFailureModal("Oops!", error.error)
      })
  }
  displaySuccessModal(header: string, content: string) {
    this.modalContent = content;
    this.modalHeader = header;
    this.successModalVisibility = true;
  }
  displayFailureModal(header: string, content: ApiResponse<object>) {
    this.modalContent = content.message;
    this.modalHeader = header;
    this.failureModalVisibility = true;
  }
  redirect(pageName: string = '') {
    this.router.navigate([`${pageName}`]);
  }
  getRequestData(requestData: DriverRegistrationRequest): FormData {
    const formData = new FormData();
    const blob = new Blob([JSON.stringify(requestData)], { type: "application/json" });
    formData.append('registrationRequest', blob);
    formData.append('image', this.uploadedFile);
    return formData;
  }
  compareValidator(controlOne: AbstractControl, controlTwo: AbstractControl) {
    return () => {
      if (controlOne.value !== controlTwo.value)
        return { match_error: 'Passwords do not match' };
      return null;
    };
  }
}
