import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { UserProvider, MatchProvider } from '../../providers/providers';
import { Match } from '../../models/tournament/match';
import { presentToast } from '../pages';

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
		public matchProvider: MatchProvider
	) {
		this.loadMatchsWithBets();
	}

	loadMatchsWithBets() {
		let userId: number = this.userProvider.user.userId;

		this.matchProvider.getMatchsWithBetsByUserId(userId).subscribe(
			(res: any) => {
				this.matchList = res.body;
			},
			err => {
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
