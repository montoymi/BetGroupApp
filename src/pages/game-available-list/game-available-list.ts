import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Refresher } from 'ionic-angular';
import * as moment from 'moment';

import { DATE_FORMAT } from '../../constants/constants';
import { UserProvider, PollaProvider } from '../../providers/providers';
import { PollaHeader } from '../../models/polla/polla-header';
import { Item } from '../../models/item';
import { presentToast } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-game-available-list',
	templateUrl: 'game-available-list.html'
})
export class GameAvailableListPage {
	pollaHeaderList: PollaHeader[];
	groupArray;

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
		this.loadPollas(null);
	}

	loadPollas(refresher: Refresher) {
		let userId: number = this.userProvider.user.userId;

		this.pollaProvider.getPollasByUserId(userId, false).subscribe(
			(res: any) => {
				if (refresher) refresher.complete();
				this.pollaHeaderList = res.body;
				this.groupArray = this.buildGroupArray(this.pollaHeaderList);
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
			this.pollaHeaderList = this.pollaHeaderList.filter(pollaHeader => {
				return pollaHeader.pollaName.toLowerCase().indexOf(name.toLowerCase()) > -1;
			});
			this.groupArray = this.buildGroupArray(this.pollaHeaderList);
		} else {
			// Reset items back to all of the items
			this.loadPollas(null);
		}
	}

	openGameTabsPage(pollaHeader: PollaHeader) {
		this.navCtrl.push('GameAvailableTabsPage', { pollaHeader: pollaHeader });
	}

	/*
	 * Funciones para el agrupamiento.
	 */

	buildGroupArray(pollaHeaderList: PollaHeader[]) {
		let groupArray = new Array<Item>();

		// Crea el array de grupos.
		for (let pollaHeader of pollaHeaderList) {
			let strDate: string = moment(pollaHeader.startDate).format(DATE_FORMAT);

			if (!this.contains(groupArray, strDate)) {
				let group: Item = new Item({
					strDate: strDate,
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
				if (pollaHeader.startDate == group.strDate) {
					group.pollaHeaderArray.push(pollaHeader);
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
