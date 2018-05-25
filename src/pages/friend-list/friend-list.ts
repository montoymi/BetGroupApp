import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { UserProvider, FriendProvider } from '../../providers/providers';
import { Friend } from '../../models/account/friend';
import { presentToast, presentLoading } from '../pages';

@IonicPage()
@Component({
	selector: 'page-friend-list',
	templateUrl: 'friend-list.html'
})
export class FriendListPage {
	friendList: Friend[];

	private unfollowSuccess: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public friendProvider: FriendProvider,
		public loadingCtrl: LoadingController
	) {
		this.translate.get(['UNFOLLOW_SUCCESS']).subscribe(values => {
			this.unfollowSuccess = values['UNFOLLOW_SUCCESS'];
		});
	}

	ionViewCanEnter(): boolean {
		if (!this.userProvider.user) {
			return false;
		}

		return true;
	}

	// Runs when the page has loaded. This event is NOT fired on
	// entering a view that is already cached.
	ionViewDidLoad() {
		this.loadFriends();
	}

	loadFriends() {
		let loading = presentLoading(this.loadingCtrl);
		this.friendProvider.getFriendsByUserId(this.userProvider.user.userId).subscribe(
			(res: any) => {
				loading.dismiss();
				this.friendList = res.body;
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	deleteFriend(friendId: number) {
		let loading = presentLoading(this.loadingCtrl);
		this.friendProvider.deleteFriend(friendId).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.unfollowSuccess);
				this.loadFriends();
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	filter(ev) {
		// set val to the value of the ev target
		let name: string = ev.target.value;

		// if the value is an empty string don't filter the items
		if (name && name.trim() != '') {
			this.friendList = this.friendList.filter(friend => {
				return friend.user.username.toLowerCase().indexOf(name.toLowerCase()) > -1;
			});
		} else {
			// Reset items back to all of the items
			this.loadFriends();
		}
	}
}
