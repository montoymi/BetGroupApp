import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';

import { UserProvider } from '../../providers/providers';
import { User } from '../../models/account/user';
import { RESPONSE_ERROR, EMAIL_PATTERN } from '../../constants/constants';
import { presentToast, getFlagValue, presentLoading } from '../pages';

@IonicPage()
@Component({
	selector: 'page-user-save',
	templateUrl: 'user-save.html'
})
export class UserSavePage {
	user: User;

	private userSaveSuccess: string;
	private usernameRequiredError: string;
	private usernameMaxlengthError: string;
	private emailRequiredError: string;
	private emailPatternError: string;
	private signupNicknameError: string;
	private signupEmailError: string;

	form: FormGroup;

	validationMessages;

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
				'SIGNUP_EMAIL_ERROR'
			])
			.subscribe(values => {
				this.userSaveSuccess = values['USER_SAVE_SUCCESS'];
				this.usernameRequiredError = values['USERNAME_REQUIRED_ERROR'];
				this.usernameMaxlengthError = values['USERNAME_MAXLENGTH_ERROR'];
				this.emailRequiredError = values['EMAIL_REQUIRED_ERROR'];
				this.emailPatternError = values['EMAIL_PATTERN_ERROR'];
				this.signupNicknameError = values['SIGNUP_NICKNAME_ERROR'];
				this.signupEmailError = values['SIGNUP_EMAIL_ERROR'];
			});

		this.loadUser();

		this.validationMessages = {
			username: [{ type: 'required', message: this.usernameRequiredError }, { type: 'maxlength', message: this.usernameMaxlengthError }],
			email: [{ type: 'required', message: this.emailRequiredError }, { type: 'pattern', message: this.emailPatternError }]
		};
	}

	ngOnInit() {
		this.form = this.formBuilder.group({
			username: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(15)])),
			firstName: new FormControl(''),
			lastName: new FormControl(''),
			sex: new FormControl(''),
			dateOfBirthday: new FormControl(''),
			email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(EMAIL_PATTERN)])),
			flagNotification: new FormControl('')
		});
	}

	loadUser() {
		let userId: number = this.userProvider.user.userId;

		let loading = presentLoading(this.loadingCtrl);
		this.userProvider.getUserById(userId).subscribe(
			(res: any) => {
				loading.dismiss();
				this.user = res.body;
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	updateUser() {
		this.user.flagNotification = getFlagValue(this.user.flagNotification);

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
