import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IonicPage, NavController, ToastController, LoadingController, ViewController } from 'ionic-angular';

import { UserProvider } from '../../providers/providers';
import { User } from '../../models/account/user';
import { presentToast, presentLoading } from '../pages';
import { PASSWORD_PATTERN } from '../../constants/constants';
import { PasswordValidator } from '../../validators/password.validator';

@IonicPage()
@Component({
	selector: 'page-change-password',
	templateUrl: 'change-password.html'
})
export class ChangePasswordPage {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;

	private changePasswordSuccess: string;
	private currentPasswordError: string;
	private passwordRequiredError: string;
	private passwordMinlengthError: string;
	private passwordPatternError: string;
	private confirmPasswordRequiredError: string;
	private confirmPasswordAreEqualError: string;

	form: FormGroup;
	passwords: FormGroup;

	validationMessages;

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
	}

	ngOnInit() {
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
			currentPassword: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.userProvider.user.password)])),
			passwords: this.passwords
		});
	}

	ionViewCanEnter(): boolean {
		if (!this.userProvider.user) {
			return false;
		}

		return true;
	}

	changePassword() {
		let user: User = new User();
		user.userId = this.userProvider.user.userId;
		user.password = this.newPassword;

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
