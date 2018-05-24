import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, MenuController, LoadingController } from 'ionic-angular';

import { UserProvider } from '../../providers/providers';
import { User } from '../../models/account/user';
import { MainPage, presentToast, presentLoading } from '../pages';
import { RESPONSE_ERROR } from '../../constants/constants';

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class LoginPage {
	user: User;
	keepSession: boolean;

	private loginNicknameError: string;
	private loginPasswordError: string;
	private forgotPasswordTitle: string;
	private forgotPasswordSubtitle: string;
	private forgotPasswordSuccess: string;
	private forgotPasswordError: string;
	private forgotPasswordError2: string;
	private email: string;
	private cancelButton: string;
	private okButton: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public menu: MenuController,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		private alertCtrl: AlertController,
		public userProvider: UserProvider,
		public loadingCtrl: LoadingController
	) {
		this.translate
			.get([
				'LOGIN_NICKNAME_ERROR',
				'LOGIN_PASSWORD_ERROR',
				'FORGOT_PASSWORD_TITLE',
				'FORGOT_PASSWORD_SUBTITLE',
				'FORGOT_PASSWORD_SUCCESS',
				'FORGOT_PASSWORD_ERROR',
				'FORGOT_PASSWORD_ERROR2',
				'EMAIL',
				'CANCEL_BUTTON',
				'OK_BUTTON'
			])
			.subscribe(values => {
				this.loginNicknameError = values['LOGIN_NICKNAME_ERROR'];
				this.loginPasswordError = values['LOGIN_PASSWORD_ERROR'];
				this.forgotPasswordTitle = values['FORGOT_PASSWORD_TITLE'];
				this.forgotPasswordSubtitle = values['FORGOT_PASSWORD_SUBTITLE'];
				this.forgotPasswordSuccess = values['FORGOT_PASSWORD_SUCCESS'];
				this.forgotPasswordError = values['FORGOT_PASSWORD_ERROR'];
				this.forgotPasswordError2 = values['FORGOT_PASSWORD_ERROR2'];
				this.email = values['EMAIL'];
				this.cancelButton = values['CANCEL_BUTTON'];
				this.okButton = values['OK_BUTTON'];
			});

		this.user = new User();

		//this.user.username = 'Rubym';
		//this.user.password = 'test1';
		//this.user.username = 'Kcire';
		//this.user.password = 'bacardi1';
		//IntiTec02
	}

	doLogin() {
		let loading = presentLoading(this.loadingCtrl);
		this.userProvider.login(this.user, this.keepSession).subscribe(
			(res: any) => {
				loading.dismiss();
				this.navCtrl.push(MainPage);
			},
			err => {
				loading.dismiss();
				switch (err.error) {
					case RESPONSE_ERROR.LOGIN_NICKNAME_ERROR:
						presentToast(this.toastCtrl, this.loginNicknameError);
						break;
					case RESPONSE_ERROR.LOGIN_PASSWORD_ERROR:
						presentToast(this.toastCtrl, this.loginPasswordError);
						break;
					default:
						presentToast(this.toastCtrl, err.message);
						break;
				}
			}
		);
	}

	forgotPassword(email: string) {
		let lang = this.translate.store.currentLang;

		let loading = presentLoading(this.loadingCtrl);
		this.userProvider.forgotPassword(email, lang).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.forgotPasswordSuccess);
				console.info(res.message);
			},
			err => {
				loading.dismiss();
				switch (err.error) {
					case RESPONSE_ERROR.FORGOT_PASSWORD_ERROR:
						presentToast(this.toastCtrl, this.forgotPasswordError);
						break;
					case RESPONSE_ERROR.FORGOT_PASSWORD_ERROR2:
						presentToast(this.toastCtrl, this.forgotPasswordError2);
						break;
					default:
						presentToast(this.toastCtrl, err.message);
						break;
				}
			}
		);
	}

	presentPrompt() {
		let alert = this.alertCtrl.create({
			title: this.forgotPasswordTitle,
			subTitle: this.forgotPasswordSubtitle,
			inputs: [
				{
					name: 'email',
					placeholder: this.email,
					type: 'email'
				}
			],
			buttons: [
				{
					text: this.cancelButton,
					role: 'cancel',
					handler: data => {
						console.log('Cancel clicked');
					}
				},
				{
					text: this.okButton,
					handler: data => {
						this.forgotPassword(data.email);
					}
				}
			]
		});
		alert.present();
	}

	ionViewDidEnter() {
		// the root left menu should be disabled on the login page
		this.menu.enable(false);
	}

	ionViewWillLeave() {
		// enable the root left menu when leaving the login page
		this.menu.enable(true);
	}
}
