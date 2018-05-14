import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

import { UserProvider } from '../../providers/providers';
import { User } from '../../models/account/user';
import { presentToast } from '../pages';

@IonicPage()
@Component({
	selector: 'page-user-detail',
	templateUrl: 'user-detail.html'
})
export class UserDetailPage {
	user: User;

	private changePasswordTitle: string;
	private currentPassword: string;
	private newPassword: string;
	private confirmPassword: string;
	private changePasswordSuccess: string;
	private currentPasswordError: string;
	private confirmPasswordError: string;
	private cancelButton: string;
	private okButton: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		private alertCtrl: AlertController,
		public userProvider: UserProvider
	) {
		this.translate
			.get([
				'CHANGE_PASSWORD_TITLE',
				'CURRENT_PASSWORD',
				'NEW_PASSWORD',
				'CONFIRM_PASSWORD',
				'CHANGE_PASSWORD_SUCCESS',
				'CURRENT_PASSWORD_ERROR',
				'CONFIRM_PASSWORD_ERROR',
				'CANCEL_BUTTON',
				'OK_BUTTON'
			])
			.subscribe(values => {
				this.changePasswordTitle = values['CHANGE_PASSWORD_TITLE'];
				this.currentPassword = values['CURRENT_PASSWORD'];
				this.newPassword = values['NEW_PASSWORD'];
				this.confirmPassword = values['CONFIRM_PASSWORD'];
				this.changePasswordSuccess = values['CHANGE_PASSWORD_SUCCESS'];
				this.currentPasswordError = values['CURRENT_PASSWORD_ERROR'];
				this.confirmPasswordError = values['CONFIRM_PASSWORD_ERROR'];
				this.cancelButton = values['CANCEL_BUTTON'];
				this.okButton = values['OK_BUTTON'];
			});

		this.user = userProvider.user;
	}

	openUserSavePage() {
		this.navCtrl.push('UserSavePage');
	}

	changePassword() {
		this.userProvider.changePassword(this.user).subscribe(
			(res: any) => {
				presentToast(this.toastCtrl, this.changePasswordSuccess);
				this.user = res.body;
			},
			err => {
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	presentChangePasswordPrompt() {
		let alert = this.alertCtrl.create({
			title: this.changePasswordTitle,
			inputs: [
				{
					name: 'currentPassword',
					placeholder: this.currentPassword,
					type: 'password'
				},
				{
					name: 'newPassword',
					placeholder: this.newPassword,
					type: 'password'
				},
				{
					name: 'confirmPassword',
					placeholder: this.confirmPassword,
					type: 'password'
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
						if (this.validatePassword(data)) {
							this.user.password = data.newPassword;
							this.changePassword();
						} else {
							return false;
						}
					}
				}
			]
		});
		alert.present();
	}

	validatePassword(data) {
		if (data.currentPassword != this.user.password) {
			presentToast(this.toastCtrl, this.currentPasswordError);
			return false;
		}

		if (data.newPassword == "" || data.newPassword != data.confirmPassword) {
			presentToast(this.toastCtrl, this.confirmPasswordError);
			return false;
		}

		return true;
	}
}
