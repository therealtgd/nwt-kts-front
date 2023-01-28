import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUpload } from 'primeng/fileupload/fileupload';
import { ApiResponse } from 'src/app/dto/api-response';
import { RegistrationRequest } from 'src/app/dto/registration-request';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ImageService } from 'src/app/services/image/image.service';
import { ConfirmPasswordValidator } from '../../validators/confirm-password.validator';

@Component({
  selector: 'app-client-registration',
  templateUrl: './client-registration.component.html',
  styleUrls: ['./client-registration.component.css']
})
export class ClientRegistrationComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private imageService: ImageService
  ) { }

  @ViewChild('fileUpload')
  fileUpload!: FileUpload;

  successModalVisibility: boolean = false;
  errorModalVisibility: boolean = false;
  modalHeader: string = '';
  modalContent: string = '';
  uploadedFile!: File;
  form!: FormGroup;
  url: any;

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      username: [''],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      phoneNumber: ['']
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
  save() {
    let registrationData: RegistrationRequest = {
      displayName: this.form.value.firstName + ' ' + this.form.value.lastName,
      email: this.form.value.email,
      username: this.form.value.username,
      password: this.form.value.password,
      confirmPassword: this.form.value.confirmPassword,
      phoneNumber: this.form.value.phoneNumber,
      socialProvider: 'LOCAL'
    };

    this.authService.registerClient(registrationData)
      .subscribe({
        next: (data) => this.handleImageSuccess(data as ApiResponse),
        error: (error) => this.handleRegistrationError(error.error as ApiResponse)
      });
  }
  getImageData(email: string): FormData {
    const formData = new FormData();
    formData.append('email', email);
    formData.append(
      'image',
      this.uploadedFile
    );
    return formData;
  }
  redirect(pageName: string = '') {
    this.router.navigate([`${pageName}`]);
  }
  handleImageSuccess(response: ApiResponse) {
    this.displaySuccessModal("Success!", "You have successfully registered.");
  }
  handleRegistrationSuccess(response: ApiResponse) {
    this.imageService.upload(this.getImageData(response.message))
      .subscribe({
        next: (data) => this.handleImageSuccess(data as ApiResponse),
        error: (error) => this.handleRegistrationError(error.error as ApiResponse)
      });
  }
  handleRegistrationError(error: ApiResponse) {
    console.log(error)
    this.displayErrorModal("Oops!", error.message);
  }
  displaySuccessModal(header: string, content: Object) {
    this.modalContent = content.toString();
    this.modalHeader = header;
    this.successModalVisibility = true;
  }
  displayErrorModal(header: string, content: Object) {
    this.modalContent = content.toString();
    this.modalHeader = header;
    this.errorModalVisibility = true;
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
