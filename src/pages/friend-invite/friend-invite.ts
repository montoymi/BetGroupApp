import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, Navbar, ToastController, AlertController, LoadingController } from 'ionic-angular';

import { UserProvider, FriendProvider } from '../../providers/providers';
import { Friend } from '../../models/account/friend';
import { User } from '../../models/account/user';
import { PollaHeader } from '../../models/polla/polla-header';
import { presentToast, presentLoading } from '../pages';
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
	private inviteFriendError2: string;
	private inviteFriendError3: string;
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
		private alertCtrl: AlertController,
		public loadingCtrl: LoadingController
	) {
		this.translate
			.get([
				'INVITE_FRIEND_SUCCESS',
				'INVITE_FRIEND_ERROR',
				'INVITE_FRIEND_ERROR2',
				'INVITE_FRIEND_ERROR3',
				'INVITE_FRIEND_ALERT_TITLE',
				'INVITE_FRIEND_ALERT_SUBTITLE',
				'OK_BUTTON'
			])
			.subscribe(values => {
				this.inviteFriendSuccess = values['INVITE_FRIEND_SUCCESS'];
				this.inviteFriendError = values['INVITE_FRIEND_ERROR'];
				this.inviteFriendError2 = values['INVITE_FRIEND_ERROR2'];
				this.inviteFriendError3 = values['INVITE_FRIEND_ERROR3'];
				this.inviteFriendAlertTitle = values['INVITE_FRIEND_ALERT_TITLE'];
				this.inviteFriendAlertSubtitle = values['INVITE_FRIEND_ALERT_SUBTITLE'];
				this.okButton = values['OK_BUTTON'];
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
		this.navBar.backButtonClick = (e: UIEvent) => {
			this.navCtrl.parent.viewCtrl.dismiss();
		};

		this.friend = new Friend();
		this.friend.user = this.userProvider.user;
		this.friend.amigo = new User();
		
		this.loadFriends();
	}

	setByEmail(byEmail) {
		this.byEmail = byEmail;
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

	inviteFriend() {
		// Se retira esta opción del tab de juegos disponibles.
		// pero se mantiene el código de validación comentado.
		// Si se habilita, ver la forma de mostrar el alert sin
		// usar el flag myPollas, ya que este ya no se pasa entre 
		// las paginas.

		/*
		let myPollas: boolean = this.navParams.get('myPollas');
		if (!myPollas) {
			this.presentAlert();
			return;
		}
		*/

		let pollaHeader: PollaHeader = this.navParams.get('pollaHeader');

		let loading = presentLoading(this.loadingCtrl);
		this.friendProvider.inviteFriend(pollaHeader.pollaId, this.friend).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.inviteFriendSuccess);
				this.friend = res.body;
			},
			err => {
				loading.dismiss();
				switch (err.error) {
					case RESPONSE_ERROR.INVITE_FRIEND_ERROR:
						presentToast(this.toastCtrl, this.inviteFriendError);
						break;
					case RESPONSE_ERROR.INVITE_FRIEND_ERROR2:
						presentToast(this.toastCtrl, this.inviteFriendError2);
						break;
					case RESPONSE_ERROR.INVITE_FRIEND_ERROR3:
						presentToast(this.toastCtrl, this.inviteFriendError3);
						break;
					default:
						presentToast(this.toastCtrl, err.message);
						break;
				}
			}
		);
	}

	presentAlert() {
		let alert = this.alertCtrl.create({
			title: this.inviteFriendAlertTitle,
			subTitle: this.inviteFriendAlertSubtitle,
			buttons: [this.okButton]
		});
		alert.present();
	}
}
