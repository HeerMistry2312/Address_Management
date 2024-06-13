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
  constructor(private snackbar: MatSnackBar){}

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
    const username = data.username
    this.snackbar.open(`${username} Updated Successful!!!`, 'Close', {
      duration: 3000,
    });
  }
 selectUserForDelete(data:User){
  const username = data.username
  this.snackbar.open(`${username} Deleted Successful!!!`, 'Close', {
    duration: 3000,
  });
 }
}
