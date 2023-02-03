import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { firstValueFrom } from 'rxjs';
import { ContextData } from 'src/app/dto/context-data';
import { UpdateDriver } from 'src/app/dto/update-driver';
import { UpdatePassword } from 'src/app/dto/update-password';
import { UpdateUser } from 'src/app/dto/update-user';
import { ApiResponse } from 'src/app/models/api-response';
import { Driver } from 'src/app/models/driver';
import { DriverService } from 'src/app/services/driver/driver.service';
import { UserService } from 'src/app/services/user/user.service';
import { ConfirmPasswordValidator } from 'src/app/validators/confirm-password.validator';

@Component({
  selector: 'app-edit-driver-profile',
  templateUrl: './edit-driver-profile.component.html',
  styleUrls: ['./edit-driver-profile.component.css']
})
export class EditDriverProfileComponent {

  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @Input() user!: ContextData;
  @Input() uploadedFile!: File;
  successModalVisibility: boolean = false;
  failureModalVisibility: boolean = false;
  modalHeader: string = '';
  modalContent: string = '';
  userUpdateForm!: FormGroup;
  passwordUpdateForm!: FormGroup;
  vehicleTypes: string[] = ["SEDAN", "WAGON"];
  licencePlateRegex: RegExp = /^[^<>*!?\s\[\];'\\,./`+=]+$/;
  driver!: Driver;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private driverService: DriverService,
  ) { }


  async ngOnInit() {

    this.passwordUpdateForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
      {
        validator: ConfirmPasswordValidator("password", "confirmPassword")
      });
    const response = await firstValueFrom(this.driverService.getDriver())
    if (response.success && response.body) {
      this.initializeForm(response.body as Driver);
    } else {
      this.displayFailureModal("Oops!", response)
    }
  }
  initializeForm(data: Driver) {
    this.driver = data;
    this.userUpdateForm = this.fb.group({
      displayName: [this.user.displayName],
      username: [this.user.username],
      phoneNumber: [this.user.phoneNumber],
      city: [this.user.city],
      capacity: [this.driver.vehicle.capacity],
      licencePlate: [this.driver.vehicle.licencePlate],
      vehicleType: [this.driver.vehicle.vehicleType],
      petsAllowed: [this.driver.vehicle.petsAllowed],
      babiesAllowed: [this.driver.vehicle.babiesAllowed]
    });
  }
  updateUser(): void {
    let updateRequest: UpdateDriver = {
      displayName: this.userUpdateForm.value.displayName,
      username: this.userUpdateForm.value.username,
      phoneNumber: this.userUpdateForm.value.phoneNumber,
      city: this.userUpdateForm.value.city,
      capacity: this.userUpdateForm.value.capacity,
      licencePlate: this.userUpdateForm.value.licencePlate,
      vehicleType: this.userUpdateForm.value.vehicleType,
      petsAllowed: this.userUpdateForm.value.petsAllowed,
      babiesAllowed: this.userUpdateForm.value.babiesAllowed,
      imageUploaded: this.uploadedFile !== undefined
    };
    this.driverService.updateDriver(this.getRequestData(updateRequest))
      .subscribe({
        next: (data) => this.displaySuccessModal("Success!", "You have successfully changed your information."),
        error: (error) => this.displayFailureModal("Oops!", error.error)
      })
  }
  updatePassword(): void {
    let updateRequest: UpdatePassword = {
      password: this.passwordUpdateForm.value.password,
      confirmPassword: this.passwordUpdateForm.value.confirmPassword,
    };
    this.userService.updatePassword(updateRequest)
      .subscribe({
        next: (data) => this.displaySuccessModal("Success!", "You have successfully changed your password."),
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
  reload() {
    window.location.reload();
  }
  getRequestData(requestData: UpdateDriver): FormData {
    const formData = new FormData();
    const blob = new Blob([JSON.stringify(requestData)], { type: "application/json" });
    formData.append('updateRequest', blob);
    formData.append('image', this.uploadedFile);
    console.log(formData);
    console.log(this.uploadedFile)
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
