import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
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
  userAddressForm: FormGroup;
  @Input() listData: User[] = [];
  @Output() selectUserForEdit: EventEmitter<User> = new EventEmitter<User>();
  @Output() selectUserForDelete: EventEmitter<User> = new EventEmitter<User>();
  constructor(private fb: FormBuilder, private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.userAddressForm = this.fb.group({
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

  populateForm(user: User) {
    this.userAddressForm.patchValue({
      userid: user.userid,
      username: user.username,
      email: user.email,
    });

    const addressArray = this.userAddressForm.get('address') as FormArray;
    while (addressArray.length !== 0) {
      addressArray.removeAt(0);
    }

    user.address.forEach((address: Address) => {
      addressArray.push(this.createAddressFormGroup(address));
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
        [Validators.required, Validators.minLength(5), Validators.maxLength(6)],
      ],
    });
  }

  onSubmit() {
    if (this.userAddressForm.valid) {
      const formdata: User = this.userAddressForm.value;
      this.selectUserForEdit.emit(formdata);
      this.userAddressForm.reset();
    } else {
      this.snackbar.open(`Please Fill all valid Details!!!`, 'Close', {
        duration: 3000,
      });
    }
  }

  addAddress() {
    (this.userAddressForm.get('address') as FormArray).push(
      this.createAddressFormGroup()
    );
  }

  deleteAddress(i: number) {
    if (i > 0) {
      const controls = this.userAddressForm.get('address') as FormArray;
      controls.removeAt(i);
    } else {
      this.snackbar.open(`Cannot delete the first address.`, 'Close', {
        duration: 3000,
      });
    }
  }

  onReset() {
    this.userAddressForm.reset();
  }

  onSelectUserDelete(user: User) {
    this.selectUserForDelete.emit(user);
  }
}
