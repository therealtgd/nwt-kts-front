import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDto } from 'src/app/models/user-dto';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent {
  @Output() onSelectedUser: EventEmitter<UserDto | null> = new EventEmitter();
  @Input() users!: UserDto[];

  constructor(
    private adminService: AdminService,
  ) { }

  selectedUser: UserDto | null = null;


  ngOnInit(): void {

  }

  enableUser(id: number) {
    this.adminService.enableUser(id)
      .subscribe({
        next: (data) => {
          const user = this.users.find(u => u.id === id);
          if (user)
            user.enabled = true;
        },
        error: (error) => console.error(error.error),
      });
  }

  disableUser(id: number) {
    this.adminService.disableUser(id)
      .subscribe({
        next: (data) => {
          const user = this.users.find(u => u.id === id);
          if (user)
            user.enabled = false;
        },
        error: (error) => console.error(error.error),
      });
    console.log(this.selectedUser);
  }

  onRowSelectionChange() {
    this.onSelectedUser.emit(this.selectedUser);
  }
}
