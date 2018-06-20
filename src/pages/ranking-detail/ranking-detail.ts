import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Refresher } from 'ionic-angular';

import { UserProvider, PollaProvider } from '../../providers/providers';
import { PollaParticipant } from '../../models/polla/polla-participant';
import { PollaBet } from '../../models/polla/polla-bet';
import { presentToast } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-ranking-detail',
	templateUrl: 'ranking-detail.html'
})
export class RankingDetailPage {
	pollaParticipant: PollaParticipant;
	pollaBetList: PollaBet[];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public userProvider: UserProvider,
		public pollaProvider: PollaProvider
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
		this.pollaParticipant = this.navParams.get('pollaParticipant');
		this.loadGameBets(null);
	}

	loadGameBets(refresher: Refresher) {
		let pollaId: number = this.pollaParticipant.pollaHeaderId;
		let userId: number = this.pollaParticipant.user.userId;

		this.pollaProvider.getGameBetsByPollaIdAndUserId(pollaId, userId).subscribe(
			(res: any) => {
				if (refresher) refresher.complete();
				this.pollaBetList = res.body;
			},
			err => {
				if (refresher) refresher.complete();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}
}
