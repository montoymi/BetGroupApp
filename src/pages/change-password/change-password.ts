import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IonicPage, NavController, ToastController, LoadingController, ViewController } from 'ionic-angular';

import { PASSWORD_PATTERN } from '../../constants/constants';
import { UserProvider } from '../../providers/providers';
import { User } from '../../models/account/user';
import { presentToast, presentLoading } from '../../utils/utils';
import { PasswordValidator } from '../../validators/password.validator';

@IonicPage()
@Component({
	selector: 'page-change-password',
	templateUrl: 'change-password.html'
})
export class ChangePasswordPage {
	form: FormGroup;
	passwords: FormGroup;
	validationMessages;

	private changePasswordSuccess: string;
	private currentPasswordError: string;
	private passwordRequiredError: string;
	private passwordMinlengthError: string;
	private passwordPatternError: string;
	private confirmPasswordRequiredError: string;
	private confirmPasswordAreEqualError: string;

	constructor(
		public navCtrl: NavController,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public formBuilder: FormBuilder,
		public loadingCtrl: LoadingController
	) {
		this.translate
			.get([
				'CHANGE_PASSWORD_SUCCESS',
				'CURRENT_PASSWORD_ERROR',
				'PASSWORD_REQUIRED_ERROR',
				'PASSWORD_MINLENGTH_ERROR',
				'PASSWORD_PATTERN_ERROR',
				'CONFIRM_PASSWORD_REQUIRED_ERROR',
				'CONFIRM_PASSWORD_ARE_EQUAL_ERROR'
			])
			.subscribe(values => {
				this.changePasswordSuccess = values['CHANGE_PASSWORD_SUCCESS'];
				this.currentPasswordError = values['CURRENT_PASSWORD_ERROR'];
				this.passwordRequiredError = values['PASSWORD_REQUIRED_ERROR'];
				this.passwordMinlengthError = values['PASSWORD_MINLENGTH_ERROR'];
				this.passwordPatternError = values['PASSWORD_PATTERN_ERROR'];
				this.confirmPasswordRequiredError = values['CONFIRM_PASSWORD_REQUIRED_ERROR'];
				this.confirmPasswordAreEqualError = values['CONFIRM_PASSWORD_ARE_EQUAL_ERROR'];
			});

		this.validationMessages = {
			currentPassword: [{ type: 'required', message: this.passwordRequiredError }, { type: 'pattern', message: this.currentPasswordError }],
			newPassword: [
				{ type: 'required', message: this.passwordRequiredError },
				{ type: 'minlength', message: this.passwordMinlengthError },
				{ type: 'pattern', message: this.passwordPatternError }
			],
			confirmPassword: [{ type: 'required', message: this.confirmPasswordRequiredError }],
			passwords: [{ type: 'areEqual', message: this.confirmPasswordAreEqualError }]
		};

		this.buildForm();
	}

	buildForm() {
		this.passwords = new FormGroup(
			{
				newPassword: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5), Validators.pattern(PASSWORD_PATTERN)])),
				confirmPassword: new FormControl('', Validators.required)
			},
			(formGroup: FormGroup) => {
				return PasswordValidator.areEqual(formGroup);
			}
		);

		this.form = this.formBuilder.group({
			currentPassword: ['', Validators.compose([Validators.required, Validators.pattern(this.userProvider.user.password)])],
			passwords: this.passwords
		});
	}

	prepareSave(): User {
		if (!this.validateForm()) {
			return null;
		}

		const formModel = this.form.value;

		const user: User = new User();
		user.userId = this.userProvider.user.userId;
		user.password = formModel.passwords.newPassword;

		return user;
	}

	validateForm(): boolean {
		if (!this.form.valid) {
			// Marca los controles como modificados para mostrar los mensajes de error.
			Object.keys(this.form.controls).forEach(key => {
				this.form.get(key).markAsDirty();
			});
			Object.keys(this.passwords.controls).forEach(key => {
				this.passwords.get(key).markAsDirty();
			});

			return false;
		}

		return true;
	}

	ionViewCanEnter(): boolean {
		if (!this.userProvider.user) {
			return false;
		}

		return true;
	}

	changePassword() {
		let user = this.prepareSave();
		if (!user) {
			return;
		}

		let loading = presentLoading(this.loadingCtrl);
		this.userProvider.changePassword(user).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.changePasswordSuccess);
				this.viewCtrl.dismiss();
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	cancel() {
		this.viewCtrl.dismiss();
	}

	done() {
		this.changePassword();
	}
}
