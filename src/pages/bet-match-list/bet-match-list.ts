import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { UserProvider, MatchProvider } from '../../providers/providers';
import { Match } from '../../models/tournament/match';
import { presentToast, presentLoading } from '../pages';

@IonicPage()
@Component({
	selector: 'page-bet-match-list',
	templateUrl: 'bet-match-list.html'
})
export class BetMatchListPage {
	matchList: Match[];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public userProvider: UserProvider,
		public matchProvider: MatchProvider,
		public loadingCtrl: LoadingController
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
		this.loadMatchsWithBets();
	}

	loadMatchsWithBets() {
		let userId: number = this.userProvider.user.userId;

		let loading = presentLoading(this.loadingCtrl);
		this.matchProvider.getMatchsWithBetsByUserId(userId).subscribe(
			(res: any) => {
				loading.dismiss();
				this.matchList = res.body;
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
			this.matchList = this.matchList.filter(match => {
				return match.localTeam.teamName.toLowerCase().indexOf(name.toLowerCase()) > -1;
			});
		} else {
			// Reset items back to all of the items
			this.loadMatchsWithBets();
		}
	}

	openBetMatchSavePage(match: Match) {
		this.navCtrl.push('BetMatchSavePage', { match: match });
	}
}
