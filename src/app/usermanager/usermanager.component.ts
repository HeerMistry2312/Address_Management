import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from '../interface/user';
import { Address } from '../interface/address';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-usermanager',
  templateUrl: './usermanager.component.html',
  styleUrls: ['./usermanager.component.scss'],
})
export class UsermanagerComponent implements OnInit {
  reactiveForm: FormGroup;
  list: User[] = [];
  formdata: User;
  @Input() listData: User[] = [];

  @Output() selectUserForEdit: EventEmitter<User> = new EventEmitter<User>();
  @Output() selectUserForDelete: EventEmitter<User> = new EventEmitter<User>();
  constructor(private fb: FormBuilder, private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.reactiveForm = this.fb.group({
      userid: [null, [Validators.required, Validators.maxLength(3)]],
      username: [
        null,
        [Validators.required, Validators.pattern('^[a-zA-Z0-9_-]{3,15}$')],
      ],
      email: [null, [Validators.required, Validators.email]],
      address: this.fb.array(
        [this.createAddressFormGroup()],
        Validators.required
      ),
    });
  }

  createAddressFormGroup(address?: Address): FormGroup {
    return this.fb.group({
      street: [
        address ? address.street : null,
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 .,-]+$')],
      ],
      city: [
        address ? address.city : null,
        [Validators.required, Validators.pattern('^[a-zA-Z ]+$')],
      ],
      state: [
        address ? address.state : null,
        [Validators.required, Validators.pattern('^[a-zA-Z ]+$')],
      ],
      zip: [
        address ? address.zip : null,
        [Validators.required, Validators.minLength(5),Validators.maxLength(6)],
      ],
    });
  }

  onSubmit() {
    if (this.reactiveForm.valid) {
      this.formdata = this.reactiveForm.value;
      this.list.push(this.formdata);
      localStorage.setItem('users', JSON.stringify(this.list));
      this.reactiveForm.reset();
    } else {
      this.snackbar.open(`Please Fill all valid Details!!!`, 'Close', {
        duration: 3000,
      });
    }
  }

  addAddress() {
    (this.reactiveForm.get('address') as FormArray).push(
      this.createAddressFormGroup()
    );
  }

  deleteAddress(i: number) {
    const controls = this.reactiveForm.get('address') as FormArray;
    controls.removeAt(i);
  }

  onReset() {
    this.reactiveForm.reset();
  }

  onSelectUserEdit(user: User) {
    this.reactiveForm.reset();
    this.reactiveForm.patchValue({
      userid: user.userid,
      username: user.username,
      email: user.email,
    });

    const addressArray = this.reactiveForm.get('address') as FormArray;
    while (addressArray.length !== 0) {
      addressArray.removeAt(0);
    }

    user.address.forEach((address: Address) => {
      addressArray.push(this.createAddressFormGroup(address));
    });

    this.selectUserForEdit.emit(user);
  }

  onSelectUserDelete(user: User) {
    const index = this.listData.indexOf(user);
    this.listData.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(this.listData));
    this.selectUserForDelete.emit(user);
  }
}
