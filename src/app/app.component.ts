import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from './interface/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Adress_Management';
  users: User[] = [];
  constructor(private snackbar: MatSnackBar) {}

  ngOnInit() {
    this.loadUsersFromLocalStorage();
  }

  loadUsersFromLocalStorage() {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    }
  }

  selectedUserForEdit(data: User) {
    const index = this.users.findIndex((u) => u.userid === data.userid);
    console.log(index);
    if (index !== -1) {
      this.users[index] = data;
      this.snackbar.open(`${data.username} Updated Successfully!`, 'Close', {
        duration: 3000,
      });
    } else {
      this.users.push(data);
      this.snackbar.open(`${data.username} Added Successfully!`, 'Close', {
        duration: 3000,
      });
    }
    localStorage.setItem('users', JSON.stringify(this.users));
  }
  selectUserForDelete(data: User) {
    const index = this.users.findIndex((u) => u.userid === data.userid);
    if (index !== -1) {
      this.users.splice(index, 1);
      localStorage.setItem('users', JSON.stringify(this.users));
      this.snackbar.open(`${data.username} Deleted Successfully!`, 'Close', {
        duration: 3000,
      });
    }
  }
}
