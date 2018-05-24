import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, Navbar, ToastController, LoadingController } from 'ionic-angular';

import { PollaProvider, UserProvider, FriendProvider } from '../../providers/providers';
import { PollaParticipant } from '../../models/polla/polla-participant';
import { PollaHeader } from '../../models/polla/polla-header';
import { Friend } from '../../models/account/friend';
import { User } from '../../models/account/user';
import { presentToast, presentLoading } from '../pages';
import { RESPONSE_ERROR } from '../../constants/constants';

@IonicPage()
@Component({
	selector: 'page-participant-list',
	templateUrl: 'participant-list.html'
})
export class ParticipantListPage {
	@ViewChild(Navbar) navBar: Navbar;

	pollaParticipantList: PollaParticipant[];

	private followSuccess: string;
	private followFriendError: string;
	private followFriendError2: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public pollaProvider: PollaProvider,
		public friendProvider: FriendProvider,
		public loadingCtrl: LoadingController
	) {
		this.translate.get(['FOLLOW_SUCCESS', 'FOLLOW_FRIEND_ERROR', 'FOLLOW_FRIEND_ERROR2']).subscribe(values => {
			this.followSuccess = values['FOLLOW_SUCCESS'];
			this.followFriendError = values['FOLLOW_FRIEND_ERROR'];
			this.followFriendError2 = values['FOLLOW_FRIEND_ERROR2'];
		});

		this.loadParticipants();
	}

	ionViewDidLoad() {
		this.navBar.backButtonClick = (e: UIEvent) => {
			this.navCtrl.parent.viewCtrl.dismiss();
		};
	}

	loadParticipants() {
		let pollaHeader: PollaHeader = this.navParams.get('pollaHeader');

		let loading = presentLoading(this.loadingCtrl);
		this.pollaProvider.getParticipantsByPollaId(pollaHeader.pollaId).subscribe(
			(res: any) => {
				loading.dismiss();
				this.pollaParticipantList = res.body;
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	createFriend(participantId: number) {
		let friend: Friend = new Friend();
		friend.user = this.userProvider.user;
		friend.amigo = new User();
		friend.amigo.userId = participantId;

		let loading = presentLoading(this.loadingCtrl);
		this.friendProvider.createFriend(friend).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.followSuccess);
			},
			err => {
				loading.dismiss();
				switch (err.error) {
					case RESPONSE_ERROR.FOLLOW_FRIEND_ERROR:
						presentToast(this.toastCtrl, this.followFriendError);
						break;
					case RESPONSE_ERROR.FOLLOW_FRIEND_ERROR2:
						presentToast(this.toastCtrl, this.followFriendError2);
						break;
					default:
						presentToast(this.toastCtrl, err.message);
						break;
				}
			}
		);
	}
}
