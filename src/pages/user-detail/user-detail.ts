import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { UserProvider } from '../../providers/providers';
import { User } from '../../models/account/user';

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
		public userProvider: UserProvider
	) {}

	ionViewCanEnter(): boolean {
		if (!this.userProvider.user) {
			return false;
		}

		return true;
	}

	// Runs when the page has loaded. This event is NOT fired on
	// entering a view that is already cached.
	ionViewDidLoad() {
		this.user = this.userProvider.user;
	}

	openUserSavePage() {
		this.navCtrl.push('UserSavePage');
	}

	openChangePasswordPage() {
		let modal = this.modalCtrl.create('ChangePasswordPage');
		modal.present();
	}
}
