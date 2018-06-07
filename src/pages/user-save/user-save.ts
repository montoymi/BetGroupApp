import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';

import { UserProvider, formatISO8601_2 } from '../../providers/providers';
import { User } from '../../models/account/user';
import { Item } from '../../models/item';
import { RESPONSE_ERROR, EMAIL_PATTERN } from '../../constants/constants';
import { presentToast, getFlagValue, presentLoading } from '../pages';

@IonicPage()
@Component({
	selector: 'page-user-save',
	templateUrl: 'user-save.html'
})
export class UserSavePage {
	form: FormGroup;
	validationMessages;

	user: User;
	sexList: Item[];

	private userSaveSuccess: string;
	private usernameRequiredError: string;
	private usernameMaxlengthError: string;
	private emailRequiredError: string;
	private emailPatternError: string;
	private signupNicknameError: string;
	private signupEmailError: string;
	private sexMale: string;
	private sexFemale: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public formBuilder: FormBuilder,
		public loadingCtrl: LoadingController
	) {
		this.translate
			.get([
				'USER_SAVE_SUCCESS',
				'USERNAME_REQUIRED_ERROR',
				'USERNAME_MAXLENGTH_ERROR',
				'EMAIL_REQUIRED_ERROR',
				'EMAIL_PATTERN_ERROR',
				'SIGNUP_NICKNAME_ERROR',
				'SIGNUP_EMAIL_ERROR',
				'SEX_MALE',
				'SEX_FEMALE'
			])
			.subscribe(values => {
				this.userSaveSuccess = values['USER_SAVE_SUCCESS'];
				this.usernameRequiredError = values['USERNAME_REQUIRED_ERROR'];
				this.usernameMaxlengthError = values['USERNAME_MAXLENGTH_ERROR'];
				this.emailRequiredError = values['EMAIL_REQUIRED_ERROR'];
				this.emailPatternError = values['EMAIL_PATTERN_ERROR'];
				this.signupNicknameError = values['SIGNUP_NICKNAME_ERROR'];
				this.signupEmailError = values['SIGNUP_EMAIL_ERROR'];
				this.sexMale = values['SEX_MALE'];
				this.sexFemale = values['SEX_FEMALE'];
			});

		this.validationMessages = {
			username: [{ type: 'required', message: this.usernameRequiredError }, { type: 'maxlength', message: this.usernameMaxlengthError }],
			email: [{ type: 'required', message: this.emailRequiredError }, { type: 'pattern', message: this.emailPatternError }]
		};

		this.sexList = [
			{
				value: 'M',
				description: this.sexMale
			},
			{
				value: 'F',
				description: this.sexFemale
			}
		];

		this.user = navParams.get('user');
		this.buildForm();
	}

	buildForm() {
		this.form = this.formBuilder.group({
			username: [{ value: this.user.username, disabled: true }, Validators.compose([Validators.required, Validators.maxLength(15)])],
			firstName: [this.user.firstName],
			lastName: [this.user.lastName],
			sex: [this.user.sex],
			dateOfBirthday: [this.user.dateOfBirthday],
			email: [{ value: this.user.email, disabled: true }, Validators.compose([Validators.required, Validators.pattern(EMAIL_PATTERN)])],
			flagNotification: [this.user.flagNotification]
		});
	}

	prepareSave(): User {
		if (!this.validateForm()) {
			return null;
		}

		const formModel = this.form.value;

		this.user.username = formModel.username != undefined ? formModel.username : this.user.username;
		this.user.firstName = formModel.firstName;
		this.user.lastName = formModel.lastName;
		this.user.sex = formModel.sex;
		this.user.dateOfBirthday = formatISO8601_2(formModel.dateOfBirthday);
		this.user.email = formModel.email != undefined ? formModel.email : this.user.email;
		this.user.flagNotification = getFlagValue(formModel.flagNotification);

		return this.user;
	}

	validateForm(): boolean {
		if (!this.form.valid) {
			// Marca los controles como modificados para mostrar los mensajes de error.
			Object.keys(this.form.controls).forEach(key => {
				this.form.get(key).markAsDirty();
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

	updateUser() {
		if (!this.prepareSave()) {
			return;
		}

		let loading = presentLoading(this.loadingCtrl);
		this.userProvider.updateUser(this.user).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.userSaveSuccess);
				this.user = res.body;
				this.viewCtrl.dismiss();
			},
			err => {
				loading.dismiss();
				switch (err.error) {
					case RESPONSE_ERROR.SIGNUP_NICKNAME_ERROR:
						presentToast(this.toastCtrl, this.signupNicknameError);
						break;
					case RESPONSE_ERROR.SIGNUP_EMAIL_ERROR:
						presentToast(this.toastCtrl, this.signupEmailError);
						break;
					default:
						presentToast(this.toastCtrl, err.message);
						break;
				}
			}
		);
	}

	done() {
		this.updateUser();
	}
}
