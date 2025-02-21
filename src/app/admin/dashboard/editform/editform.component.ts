import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserData } from '../../../model/userData.model';
import { UserService } from '../../../../service/user.service';


@Component({
  selector: 'app-editform',
  templateUrl: './editform.component.html',
  styleUrl: './editform.component.css'
})
export class EditformComponent {
  @Input() selectedUser: UserData | null = null;
  @Output() cancelEdit = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<UserData>();

  onCancel(): void { this.cancelEdit.emit(); }

  constructor(private userService: UserService) { }

  onSubmit(): void {
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser).subscribe((updatedUser: UserData) => { this.userUpdated.emit(updatedUser); this.cancelEdit.emit(); },
        error => { console.error('Error updating user:', error); });
    }
  }

}
