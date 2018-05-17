import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, Navbar, ToastController, AlertController } from 'ionic-angular';

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
	private inviteFriendAlertTitle: string;
	private inviteFriendAlertSubtitle: string;
	private okButton: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public friendProvider: FriendProvider,
		private alertCtrl: AlertController
	) {
		this.translate
			.get([
				'INVITE_FRIEND_SUCCESS',
				'INVITE_FRIEND_ERROR',
				'INVITE_FRIEND_ALERT_TITLE',
				'INVITE_FRIEND_ALERT_SUBTITLE',
				'OK_BUTTON'
			])
			.subscribe(values => {
				this.inviteFriendSuccess = values['INVITE_FRIEND_SUCCESS'];
				this.inviteFriendError = values['INVITE_FRIEND_ERROR'];
				this.inviteFriendAlertTitle = values['INVITE_FRIEND_ALERT_TITLE'];
				this.inviteFriendAlertSubtitle = values['INVITE_FRIEND_ALERT_SUBTITLE'];
				this.okButton = values['OK_BUTTON']
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
		let myPollas: boolean = this.navParams.get('myPollas');
		console.info('myPollas: ' + myPollas);
		if (!myPollas) {
			this.presentFriendAlert();
			return;
		}

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

	presentFriendAlert() {
		let alert = this.alertCtrl.create({
			title: this.inviteFriendAlertTitle,
			subTitle: this.inviteFriendAlertSubtitle,
			buttons: [this.okButton]
		});
		alert.present();
	}
}
