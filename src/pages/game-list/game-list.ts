import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { UserProvider, PollaProvider } from '../../providers/providers';
import { PollaHeader } from '../../models/polla/polla-header';
import { Item } from '../../models/item';
import { presentToast, presentLoading } from '../pages';

@IonicPage()
@Component({
	selector: 'page-game-list',
	templateUrl: 'game-list.html'
})
export class GameListPage {
	pollaHeaderList: PollaHeader[];
	groupArray;

	userType: string;

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

	// Runs when the page is about to enter and become the active page.
	// Actualiza la página por la opción crear juego.
	ionViewWillEnter() {
		this.userType = this.userProvider.user.userType;

		this.loadPollas();
	}

	loadPollas() {
		let userId: number = this.userProvider.user.userId;

		let loading = presentLoading(this.loadingCtrl);
		this.pollaProvider.getPollasByUserId(userId, true).subscribe(
			(res: any) => {
				loading.dismiss();
				this.pollaHeaderList = res.body;
				this.groupArray = this.buildGroupArray(this.pollaHeaderList);
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
			this.pollaHeaderList = this.pollaHeaderList.filter(pollaHeader => {
				return pollaHeader.pollaName.toLowerCase().indexOf(name.toLowerCase()) > -1;
			});
		} else {
			// Reset items back to all of the items
			this.loadPollas();
		}
	}

	openGameSavePage() {
		this.navCtrl.push('GameSavePage');
	}

	openGameTabsPage(pollaHeader: PollaHeader) {
		this.navCtrl.push('GameTabsPage', { pollaHeader: pollaHeader });
	}

	/*
	 * Funciones para el agrupamiento.
	 */

	buildGroupArray(pollaHeaderList: PollaHeader[]) {
		let groupArray = new Array<Item>();

		// Crea el array de grupos.
		for (let pollaHeader of pollaHeaderList) {
			let status: number = pollaHeader.enabled_flag;

			if (!this.contains(groupArray, status)) {
				let group: Item = new Item({
					status: status,
					pollaHeaderArray: new Array<PollaHeader>(),
					showDetails: true,
					icon: 'ios-remove-circle-outline'
				});
				groupArray.push(group);
			}
		}

		// Asigna los items a cada grupo.
		for (let group of groupArray) {
			for (let pollaHeader of pollaHeaderList) {
				if (pollaHeader.enabled_flag == group.status) {
					group.pollaHeaderArray.push(pollaHeader);
				}
			}
		}

		return groupArray;
	}

	contains(groupArray: Array<Item>, status: number) {
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
