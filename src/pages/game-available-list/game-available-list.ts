import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { UserProvider, PollaProvider } from '../../providers/providers';
import { PollaHeader } from '../../models/polla/polla-header';
import { presentToast } from '../pages';

@IonicPage()
@Component({
	selector: 'page-game-available-list',
	templateUrl: 'game-available-list.html'
})
export class GameAvailableListPage {
	pollaHeaderList: PollaHeader[];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public userProvider: UserProvider,
		public pollaProvider: PollaProvider
	) {}

	// Runs when the page is about to enter and become the active page.
	// Se actualiza la lista por la opción inscribirse en juego.
	ionViewWillEnter() {
		this.loadPollas();
	}

	loadPollas() {
		let userId: number = this.userProvider.user.userId;

		this.pollaProvider.getPollasByUserId(userId, false).subscribe(
			(res: any) => {
				this.pollaHeaderList = res.body;
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
			this.pollaHeaderList = this.pollaHeaderList.filter(pollaHeader => {
				return pollaHeader.pollaName.toLowerCase().indexOf(name.toLowerCase()) > -1;
			});
		} else {
			// Reset items back to all of the items
			this.loadPollas();
		}
	}

	openGameTabsPage(pollaHeader: PollaHeader) {
		this.navCtrl.push('GameTabsPage', {
			pollaHeader: pollaHeader,
			myPollas: false
		});
	}
}
