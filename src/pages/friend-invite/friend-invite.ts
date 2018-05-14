import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, Navbar, ToastController } from 'ionic-angular';

import { UserProvider, FriendProvider } from '../../providers/providers';
import { Friend } from '../../models/account/friend';
import { User } from '../../models/account/user';
import { PollaHeader } from '../../models/polla/polla-header';
import { presentToast } from '../pages';
import { RESPONSE_ERROR } from '../../constants/constants';

@IonicPage()
@Component({
	selector: 'page-friend-invite',
	templateUrl: 'friend-invite.html'
})
export class FriendInvitePage {
	@ViewChild(Navbar) navBar: Navbar;
	
	byEmail: boolean = true;
	friendList: Friend[];
	friend: Friend;

	private inviteFriendSuccess: string;
	private inviteFriendError: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public friendProvider: FriendProvider
	) {
		this.translate.get(['INVITE_FRIEND_SUCCESS'], 'INVITE_FRIEND_ERROR').subscribe(values => {
			this.inviteFriendSuccess = values['INVITE_FRIEND_SUCCESS'];
			this.inviteFriendError = values['INVITE_FRIEND_ERROR'];
		});

		this.friend = new Friend();
		this.friend.user = userProvider.user;
		this.friend.amigo = new User();
		this.loadFriends();
	}

	ionViewDidLoad() {
		this.navBar.backButtonClick = (e: UIEvent) => {
			this.navCtrl.parent.viewCtrl.dismiss();
		};
	}

	setByEmail(byEmail) {
		this.byEmail = byEmail;
	}

	loadFriends() {
		this.friendProvider.getFriendsByUserId(this.userProvider.user.userId).subscribe(
			(res: any) => {
				this.friendList = res.body;
			},
			err => {
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	inviteFriend() {
		let pollaHeader: PollaHeader = this.navParams.get('pollaHeader');

		if (this.byEmail) {
			this.friend.amigo.userId = null;
		} else {
			this.friend.amigo.email = null;
		}

		this.friendProvider.inviteFriend(pollaHeader.pollaId, this.friend).subscribe(
			(res: any) => {
				presentToast(this.toastCtrl, this.inviteFriendSuccess);
				this.friend = res.body;
			},
			err => {
				switch (err.error) {
					case RESPONSE_ERROR.INVITE_FRIEND_ERROR:
						presentToast(this.toastCtrl, this.inviteFriendError);
						break;
					default:
						presentToast(this.toastCtrl, err.message);
						break;
				}
			}
		);
	}
}
