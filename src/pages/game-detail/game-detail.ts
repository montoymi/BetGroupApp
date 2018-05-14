import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, ToastController } from 'ionic-angular';

import { PollaProvider, UserProvider } from '../../providers/providers';
import { PollaParticipant } from '../../models/polla/polla-participant';
import { PollaHeader } from '../../models/polla/polla-header';
import { presentToast } from '../pages';


@IonicPage()
@Component({
	selector: 'page-game-detail',
	templateUrl: 'game-detail.html'
})
export class GameDetailPage {
	@ViewChild(Navbar) navBar: Navbar;

	pollaParticipant: PollaParticipant;
	pollaHeader: PollaHeader;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public userProvider: UserProvider,
		public pollaProvider: PollaProvider
	) {
		this.loadPolla();
	}

	ionViewDidLoad() {
		this.navBar.backButtonClick = (e: UIEvent) => {
			this.navCtrl.parent.viewCtrl.dismiss();
		};
	}

	loadPolla() {
		this.pollaHeader = this.navParams.get('pollaHeader');
		let userId = this.userProvider.user.userId;

		this.pollaProvider.getParticipantByPollaId(this.pollaHeader.pollaId, userId).subscribe(
			(res: any) => {
				this.pollaParticipant = res.body;
				this.pollaHeader = this.pollaParticipant.pollaHeader;
			},
			err => {
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	openBetListPage() {
		this.navCtrl.push('GameBetListPage', { pollaId: this.pollaHeader.pollaId });
	}
}
