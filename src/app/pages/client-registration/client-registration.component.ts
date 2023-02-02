import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUpload } from 'primeng/fileupload/fileupload';
import { RegistrationRequest } from 'src/app/dto/registration-request';
import { ApiResponse } from 'src/app/models/api-response';
import { ImageService } from 'src/app/services/image/image.service';
import { UserService } from 'src/app/services/user/user.service';
import { ConfirmPasswordValidator } from '../../validators/confirm-password.validator';

@Component({
  selector: 'app-client-registration',
  templateUrl: './client-registration.component.html',
  styleUrls: ['./client-registration.component.css']
})
export class ClientRegistrationComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private imageService: ImageService
  ) { }

  @ViewChild('fileUpload')
  fileUpload!: FileUpload;

  successModalVisibility: boolean = false;
  failureModalVisibility: boolean = false;
  noSpecial: RegExp = /^[^<>*!0-9]+$/;
  modalHeader: string = '';
  modalContent: string = '';
  uploadedFile!: File;
  form!: FormGroup;
  url: any;

  ngOnInit(): void {
    this.form = this.fb.group({
      displayName: [''],
      email: [''],
      username: [''],
      phoneNumber: [''],
      city: [''],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
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
  getRequestData(requestData: RegistrationRequest): FormData {
    const formData = new FormData();
    const blob = new Blob([JSON.stringify(requestData)], { type: "application/json" });
    formData.append('signupRequest', blob);
    formData.append('image', this.uploadedFile);
    console.log(formData);
    console.log(this.uploadedFile)
    return formData;
  }
  save() {
    console.log(this.uploadedFile);
    let registrationData: RegistrationRequest = {
      displayName: this.form.value.displayName,
      email: this.form.value.email,
      username: this.form.value.username,
      city: this.form.value.city,
      phoneNumber: this.form.value.phoneNumber,
      password: this.form.value.password,
      confirmPassword: this.form.value.confirmPassword,
      socialProvider: 'LOCAL',
      imageUploaded: this.uploadedFile !== undefined
    };
    this.userService.registerClient(this.getRequestData(registrationData))
      .subscribe({
        next: (data) => this.handleRegistrationSuccess(data),
        error: (error) => this.handleRegistrationError(error.error)
      });
  }
  handleRegistrationSuccess(response: ApiResponse<null>) {
    this.displaySuccessModal("Success!", "You have successfully registered.");
  }
  handleRegistrationError(error: ApiResponse<null>) {
    this.displayErrorModal("Oops!", error.message);
  }
  displaySuccessModal(header: string, content: string) {
    this.modalContent = content;
    this.modalHeader = header;
    this.successModalVisibility = true;
  }
  displayErrorModal(header: string, content: string) {
    this.modalContent = content;
    this.modalHeader = header;
    this.failureModalVisibility = true;
  }
  redirect(pageName: string = '') {
    this.router.navigate([`${pageName}`]);
  }

  invalidateFields(errorObject: Object) {
    const invalidFields: string[] = Object.keys(errorObject);
    invalidFields.forEach(fieldName => {
      this.form.controls[fieldName].setErrors({ 'invalid': true });
    });
  }

  compareValidator(controlOne: AbstractControl, controlTwo: AbstractControl) {
    return () => {
      if (controlOne.value !== controlTwo.value)
        return { match_error: 'Passwords do not match' };
      return null;
    };
  }
}
