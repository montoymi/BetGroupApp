import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, ToastController, LoadingController } from 'ionic-angular';

import { UserProvider, PollaProvider } from '../../providers/providers';
import { PollaHeader } from '../../models/polla/polla-header';
import { PollaBet } from '../../models/polla/polla-bet';
import { Item } from '../../models/item';
import { presentToast, presentLoading } from '../pages';

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
		this.navBar.backButtonClick = (e: UIEvent) => {
			this.navCtrl.parent.viewCtrl.dismiss();
		};
	}

	// Runs when the page is about to enter and become the active page.
	// Actualiza la página por la opción crear juego.
	ionViewWillEnter() {
		this.loadGameBets();
	}

	loadGameBets() {
		let pollaHeader: PollaHeader = this.navParams.get('pollaHeader');
		let userId: number = this.userProvider.user.userId;

		let loading = presentLoading(this.loadingCtrl);
		this.pollaProvider.getGameBetsByPollaIdAndUserId(pollaHeader.pollaId, userId).subscribe(
			(res: any) => {
				loading.dismiss();
				this.pollaBetList = res.body;

				this.groupArray = this.buildPollaBetGroupArray(this.pollaBetList);
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
			this.pollaBetList = this.pollaBetList.filter(pollaBet => {
				return pollaBet.pollaMatch.match.localTeam.teamName.toLowerCase().indexOf(name.toLowerCase()) > -1;
			});
		} else {
			// Reset items back to all of the items
			this.loadGameBets();
		}
	}

	openGameBetSavePage(pollaBet: PollaBet) {
		this.navCtrl.push('GameBetSavePage', { pollaBet: pollaBet });
	}

	/*
	 * Funciones para el agrupamiento.
	 */

	buildPollaBetGroupArray(pollaBetList: PollaBet[]) {
		let groupArray = new Array<Item>();

		// Crea el array de grupos.
		for (let pollaBet of pollaBetList) {
			let status: string = pollaBet.pollaMatch.match.enabled_flag;

			if (!this.containsStatus(groupArray, status)) {
				let group: Item = new Item({
					status: status,
					pollaBetArray: new Array<PollaBet>(),
					showDetails: true,
					icon: 'ios-remove-circle-outline'
				});
				groupArray.push(group);
			}
		}

		// Asigna los pollaBet a cada grupo.
		for (let group of groupArray) {
			for (let pollaBet of pollaBetList) {
				if (pollaBet.pollaMatch.match.enabled_flag == group.status) {
					group.pollaBetArray.push(pollaBet);
				}
			}
		}

		return groupArray;
	}

	containsStatus(groupArray: Array<Item>, status) {
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
