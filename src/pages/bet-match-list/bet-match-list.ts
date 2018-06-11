import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import * as moment from 'moment';

import { UserProvider, MatchProvider } from '../../providers/providers';
import { Match } from '../../models/tournament/match';
import { Item } from '../../models/item';
import { presentToast, presentLoading } from '../pages';
import { DATE_FORMAT } from '../../constants/constants';

@IonicPage()
@Component({
	selector: 'page-bet-match-list',
	templateUrl: 'bet-match-list.html'
})
export class BetMatchListPage {
	matchList: Match[];
	groupArray;

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
				this.groupArray = this.buildGroupArray(this.matchList);
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

	/*
	 * Funciones para el agrupamiento.
	 */

	buildGroupArray(matchList: Match[]) {
		let groupArray = new Array<Item>();

		// Crea el array de grupos.
		for (let match of matchList) {
			let strDate: string = moment(match.matchDateWithTimezone).format(DATE_FORMAT);

			if (!this.contains(groupArray, strDate)) {
				let group: Item = new Item({
					strDate: strDate,
					matchArray: new Array<Match>(),
					showDetails: true,
					icon: 'ios-remove-circle-outline'
				});
				groupArray.push(group);
			}
		}

		// Asigna los items a cada grupo.
		for (let group of groupArray) {
			for (let match of matchList) {
				let strDate: string = moment(match.matchDateWithTimezone).format(DATE_FORMAT);
				if (strDate == group.strDate) {
					group.matchArray.push(match);
				}
			}
		}

		return groupArray;
	}

	contains(groupArray: Array<Item>, strDate: string) {
		for (let group of groupArray) {
			if (group.strDate == strDate) {
				return true;
			}
		}

		return false;
	}

	toggleDetails(group) {
		if (group.showDetails) {
			group.showDetails = false;
			group.icon = 'ios-add-circle-outline';
		} else {
			group.showDetails = true;
			group.icon = 'ios-remove-circle-outline';
		}
	}
}
