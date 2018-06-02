import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IonicPage, NavController, ToastController, AlertController, LoadingController } from 'ionic-angular';

import { UserProvider, ParamValueProvider } from '../../providers/providers';
import { User } from '../../models/account/user';
import { MainPage, presentToast, presentLoading } from '../pages';
import { RESPONSE_ERROR, PASSWORD_PATTERN, EMAIL_PATTERN } from '../../constants/constants';
import { PasswordValidator } from '../../validators/password.validator';

@IonicPage()
@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html'
})
export class SignupPage {
	user: User;

	private signupSuccess: string;
	private usernameRequiredError: string;
	private usernameMaxlengthError: string;
	private emailRequiredError: string;
	private emailPatternError: string;
	private passwordRequiredError: string;
	private passwordMinlengthError: string;
	private passwordPatternError: string;
	private confirmPasswordRequiredError: string;
	private confirmPasswordAreEqualError: string;
	private termsPatternError: string;
	private signupNicknameError: string;
	private signupEmailError: string;
	private termsAlertTitle: string;
	private okButton: string;

	private terms: string;

	form: FormGroup;
	passwords: FormGroup;

	validationMessages;

	constructor(
		public navCtrl: NavController,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public paramValueProvider: ParamValueProvider,
		public formBuilder: FormBuilder,
		private alertCtrl: AlertController,
		public loadingCtrl: LoadingController
	) {
		this.translate
			.get([
				'SIGNUP_SUCCESS',
				'USERNAME_REQUIRED_ERROR',
				'USERNAME_MAXLENGTH_ERROR',
				'EMAIL_REQUIRED_ERROR',
				'EMAIL_PATTERN_ERROR',
				'PASSWORD_REQUIRED_ERROR',
				'PASSWORD_MINLENGTH_ERROR',
				'PASSWORD_PATTERN_ERROR',
				'CONFIRM_PASSWORD_REQUIRED_ERROR',
				'CONFIRM_PASSWORD_ARE_EQUAL_ERROR',
				'TERMS_PATTERN_ERROR',
				'SIGNUP_NICKNAME_ERROR',
				'SIGNUP_EMAIL_ERROR',
				'TERMS_ALERT_TITLE',
				'OK_BUTTON'
			])
			.subscribe(values => {
				this.signupSuccess = values['SIGNUP_SUCCESS'];
				this.usernameRequiredError = values['USERNAME_REQUIRED_ERROR'];
				this.usernameMaxlengthError = values['USERNAME_MAXLENGTH_ERROR'];
				this.emailRequiredError = values['EMAIL_REQUIRED_ERROR'];
				this.emailPatternError = values['EMAIL_PATTERN_ERROR'];
				this.passwordRequiredError = values['PASSWORD_REQUIRED_ERROR'];
				this.passwordMinlengthError = values['PASSWORD_MINLENGTH_ERROR'];
				this.passwordPatternError = values['PASSWORD_PATTERN_ERROR'];
				this.confirmPasswordRequiredError = values['CONFIRM_PASSWORD_REQUIRED_ERROR'];
				this.confirmPasswordAreEqualError = values['CONFIRM_PASSWORD_ARE_EQUAL_ERROR'];
				this.termsPatternError = values['TERMS_PATTERN_ERROR'];
				this.signupNicknameError = values['SIGNUP_NICKNAME_ERROR'];
				this.signupEmailError = values['SIGNUP_EMAIL_ERROR'];
				this.termsAlertTitle = values['TERMS_ALERT_TITLE'];
				this.okButton = values['OK_BUTTON'];
			});

		this.validationMessages = {
			username: [{ type: 'required', message: this.usernameRequiredError }, { type: 'maxlength', message: this.usernameMaxlengthError }],
			email: [{ type: 'required', message: this.emailRequiredError }, { type: 'pattern', message: this.emailPatternError }],
			password: [
				{ type: 'required', message: this.passwordRequiredError },
				{ type: 'minlength', message: this.passwordMinlengthError },
				{ type: 'pattern', message: this.passwordPatternError }
			],
			confirmPassword: [{ type: 'required', message: this.confirmPasswordRequiredError }],
			passwords: [{ type: 'areEqual', message: this.confirmPasswordAreEqualError }],
			terms: [{ type: 'pattern', message: this.termsPatternError }]
		};

		this.buildForm();
	}

	buildForm() {
		this.passwords = new FormGroup(
			{
				password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5), Validators.pattern(PASSWORD_PATTERN)])),
				confirmPassword: new FormControl('', Validators.required)
			},
			(formGroup: FormGroup) => {
				return PasswordValidator.areEqual(formGroup);
			}
		);

		this.form = this.formBuilder.group({
			username: ['', Validators.compose([Validators.required, Validators.maxLength(15)])],
			email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_PATTERN)])],
			passwords: this.passwords,
			terms: [false, Validators.pattern('true')]
		});
	}

	prepareSave(): User {
		const formModel = this.form.value;

		const user: User = new User();
		user.username = formModel.username;
		user.email = formModel.email;
		user.password = formModel.passwords.password;
		user.preferredLang = this.translate.store.currentLang;

		return user;
	}

	// Runs when the page has loaded. This event is NOT fired on
	// entering a view that is already cached.
	ionViewDidLoad() {
		this.loadTerms();
	}

	doSignup(values) {
		this.user = this.prepareSave();

		let loading = presentLoading(this.loadingCtrl);
		this.userProvider.signup(this.user).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.signupSuccess);
				this.navCtrl.push(MainPage);
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

	loadTerms() {
		let lang: string = this.translate.store.currentLang;

		let loading = presentLoading(this.loadingCtrl);
		this.paramValueProvider.getTerms(lang).subscribe(
			(res: any) => {
				loading.dismiss();
				this.terms = res.body.terms;
			},
			err => {
				loading.dismiss();
				switch (err.error) {
					default:
						presentToast(this.toastCtrl, err.message);
						break;
				}
			}
		);
	}

	presentAlert(ev) {
		if (!ev.checked) {
			return;
		}

		let alert = this.alertCtrl.create({
			title: this.termsAlertTitle,
			subTitle: this.terms,
			buttons: [this.okButton]
		});
		alert.present();
	}
}
