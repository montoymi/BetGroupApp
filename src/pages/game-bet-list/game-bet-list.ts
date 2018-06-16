import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, ToastController, Refresher } from 'ionic-angular';

import { UserProvider, PollaProvider, EventLoggerProvider } from '../../providers/providers';
import { PollaHeader } from '../../models/polla/polla-header';
import { PollaBet } from '../../models/polla/polla-bet';
import { Item } from '../../models/item';
import { presentToast } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-game-bet-list',
	templateUrl: 'game-bet-list.html'
})
export class GameBetListPage {
	@ViewChild(Navbar) navBar: Navbar;

	pollaBetList: PollaBet[];
	groupArray;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public userProvider: UserProvider,
		public pollaProvider: PollaProvider,
		public logger: EventLoggerProvider
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
		this.navBar.backButtonClick = (e: UIEvent) => {
			this.navCtrl.parent.viewCtrl.dismiss();
		};

		this.loadGameBets(null);

		this.logger.logEvent(this.navCtrl.getActive().name, 'game_bet_list', null);
	}

	loadGameBets(refresher: Refresher) {
		let pollaHeader: PollaHeader = this.navParams.get('pollaHeader');
		let userId: number = this.userProvider.user.userId;

		this.pollaProvider.getGameBetsByPollaIdAndUserId(pollaHeader.pollaId, userId).subscribe(
			(res: any) => {
				if (refresher) refresher.complete();
				this.pollaBetList = res.body;
				this.groupArray = this.buildGroupArray(this.pollaBetList);
			},
			err => {
				if (refresher) refresher.complete();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	filter(ev) {
		// set val to the value of the ev target
		let name: string = ev.target.value;

		// if the value is an empty string don't filter the items
		if (name && name.trim() != '') {
			this.pollaBetList = this.pollaBetList.filter(pollaBet => {
				return pollaBet.pollaMatch.match.localTeam.teamName.toLowerCase().indexOf(name.toLowerCase()) > -1;
			});
			this.groupArray = this.buildGroupArray(this.pollaBetList);
		} else {
			// Reset items back to all of the items
			this.loadGameBets(null);
		}
	}

	openGameBetSavePage(pollaBet: PollaBet) {
		this.navCtrl.push('GameBetSavePage', { pollaBet: pollaBet });
	}

	/*
	 * Funciones para el agrupamiento.
	 */

	buildGroupArray(pollaBetList: PollaBet[]) {
		let groupArray = new Array<Item>();

		// Crea el array de grupos.
		for (let pollaBet of pollaBetList) {
			let status: string = pollaBet.pollaMatch.match.enabled_flag;

			if (!this.contains(groupArray, status)) {
				let group: Item = new Item({
					status: status,
					pollaBetArray: new Array<PollaBet>(),
					showDetails: true,
					icon: 'ios-remove-circle-outline'
				});
				groupArray.push(group);
			}
		}

		// Asigna los items a cada grupo.
		for (let group of groupArray) {
			for (let pollaBet of pollaBetList) {
				if (pollaBet.pollaMatch.match.enabled_flag == group.status) {
					group.pollaBetArray.push(pollaBet);
				}
			}
		}

		return groupArray;
	}

	contains(groupArray: Array<Item>, status: string) {
		for (let group of groupArray) {
			if (group.status == status) {
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
