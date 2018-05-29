import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, LoadingController } from 'ionic-angular';

import { UserProvider, formatISO8601 } from '../../providers/providers';
import { User } from '../../models/account/user';
import { presentToast, presentLoading } from '../pages';

@IonicPage()
@Component({
	selector: 'page-user-detail',
	templateUrl: 'user-detail.html'
})
export class UserDetailPage {
	user: User;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public modalCtrl: ModalController, 
		public userProvider: UserProvider,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController
	) {}

	ionViewCanEnter(): boolean {
		if (!this.userProvider.user) {
			return false;
		}

		return true;
	}

	// Runs when the page is about to enter and become the active page.
	// Actualiza la página por las opción editar perfil.
	ionViewWillEnter() {
		this.loadUser();
	}

	loadUser() {
		let userId: number = this.userProvider.user.userId;

		let loading = presentLoading(this.loadingCtrl);
		this.userProvider.getUserById(userId).subscribe(
			(res: any) => {
				loading.dismiss();

				let user: User = res.body;
				user.dateOfBirthday = formatISO8601(user.dateOfBirthday);
				this.user = user;
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	openUserSavePage() {
		this.navCtrl.push('UserSavePage');
	}

	openChangePasswordPage() {
		let modal = this.modalCtrl.create('ChangePasswordPage');
		modal.present();
	}
}
