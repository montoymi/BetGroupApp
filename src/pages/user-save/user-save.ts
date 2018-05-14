import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

import { UserProvider } from '../../providers/providers';
import { User } from '../../models/account/user';
import { RESPONSE_ERROR } from '../../constants/constants';
import { presentToast, getFlagValue } from '../pages';

@IonicPage()
@Component({
	selector: 'page-user-save',
	templateUrl: 'user-save.html'
})
export class UserSavePage {
	user: User;

	private userSaveSuccess: string;
	private signupNicknameError: string;
	private signupEmailError: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public userProvider: UserProvider
	) {
		this.translate.get(['USER_SAVE_SUCCESS', 'SIGNUP_NICKNAME_ERROR', 'SIGNUP_EMAIL_ERROR']).subscribe(values => {
			this.userSaveSuccess = values['USER_SAVE_SUCCESS'];
			this.signupNicknameError = values['SIGNUP_NICKNAME_ERROR'];
			this.signupEmailError = values['SIGNUP_EMAIL_ERROR'];
		});

		this.user = userProvider.user;
	}

	updateUser() {
		this.user.flagNotification = getFlagValue(this.user.flagNotification);

		this.userProvider.updateUser(this.user).subscribe(
			(res: any) => {
				presentToast(this.toastCtrl, this.userSaveSuccess);
				this.user = res.body;
				this.viewCtrl.dismiss();
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

	done() {
		this.updateUser();
	}
}
