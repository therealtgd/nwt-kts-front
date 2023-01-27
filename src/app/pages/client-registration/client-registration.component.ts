import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUpload } from 'primeng/fileupload/fileupload';
import { RegistrationRequest } from 'src/app/dto/registration-request';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfirmPasswordValidator } from '../../validators/confirm-password.validator'; 
​
@Component({
  selector: 'app-client-registration',
  templateUrl: './client-registration.component.html',
  styleUrls: ['./client-registration.component.css']
})
export class ClientRegistrationComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
    ) {}
  
  @ViewChild('fileUpload')
  fileUpload!: FileUpload;

  modalVisibility: boolean = false;
  modalHeader: string = '';
  modalContent: string = '';
  form!: FormGroup;
  url : any;

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      username: [''],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      phoneNumber: [''],
      myFile: new FormControl(),
    },
    {
      validator: ConfirmPasswordValidator("password", "confirmPassword")
    });
  }
  
  uploadFile(event : any) {
    for (let file of event.files) {
      this.form.patchValue({ myFile: file });
      this.form.get('myFile')?.updateValueAndValidity();
    }
  }
  showImage() {
    if (this.form.value.myFile === null) { return; }
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.url = event.target.result;
    };
    reader.onerror = (event: any) => {
      console.log("File could not be read: " + event.target.error.code);
    };
    reader.readAsDataURL(this.form.value.myFile);
  }
  save(){
    this.fileUpload.upload();
    this.showImage();
    let registrationData: RegistrationRequest = {
      "displayName": this.form.value.firstName + ' ' + this.form.value.lastName,
      "email": this.form.value.email,
      "username": this.form.value.username,
      "password": this.form.value.password,
      "confirmPassword" : this.form.value.confirmPassword,
      "phoneNumber": this.form.value.phoneNumber,
      "image": "",
      socialProvider: 'LOCAL'
    };
    console.log(registrationData);
    this.authService.registerClient(registrationData)
    .subscribe(
      data => { this.displayModal("Success!", "You have successfully registered."); this.router.navigate(['/login']); },
      error => {this.displayModal("Oops!", error.error.message); console.log(error);}
      );
  }
  displayModal(header : string, content : Object) {
    this.modalContent = content.toString();
    this.modalHeader = header;
    this.modalVisibility = true;
  }

  invalidateFields(errorObject: Object) {
    const invalidFields: string[] = Object.keys(errorObject);
    invalidFields.forEach(fieldName => {
      this.form.controls[fieldName].setErrors({'invalid': true});
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
