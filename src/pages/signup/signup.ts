import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { UserProvider } from '../../providers/providers';
import { User } from '../../models/account/user';
import { MainPage, presentToast } from '../pages';
import { RESPONSE_ERROR } from '../../constants/constants';

@IonicPage()
@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html'
})
export class SignupPage {
	user: User;

	private signupSuccess: string;
	private confirmPasswordError: string;
	private signupNicknameError: string;
	private signupEmailError: string;

	constructor(
		public navCtrl: NavController,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public userProvider: UserProvider
	) {
		this.translate
			.get(['SIGNUP_SUCCESS', 'CONFIRM_PASSWORD_ERROR', 'SIGNUP_NICKNAME_ERROR', 'SIGNUP_EMAIL_ERROR'])
			.subscribe(values => {
				this.signupSuccess = values['SIGNUP_SUCCESS'];
				this.confirmPasswordError = values['CONFIRM_PASSWORD_ERROR'];
				this.signupNicknameError = values['SIGNUP_NICKNAME_ERROR'];
				this.signupEmailError = values['SIGNUP_EMAIL_ERROR'];
			});

		this.user = new User();
	}

	doSignup() {
		// TODO: Validar campos requeridos

		if (this.user.password != this.user.confirmPassword) {
			// TODO: Mostrar los mensajes de validación en la UI como labels rojos en el campo.
			presentToast(this.toastCtrl, this.confirmPasswordError);
			return;
		}

		this.userProvider.signup(this.user).subscribe(
			(res: any) => {
				presentToast(this.toastCtrl, this.signupSuccess);
				this.navCtrl.push(MainPage);
			},
			err => {
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
}
