import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, Navbar, ToastController } from 'ionic-angular';

import { PollaProvider } from '../../providers/providers';
import { PollaParticipant } from '../../models/polla/polla-participant';
import { PollaHeader } from '../../models/polla/polla-header';
import { presentToast } from '../pages';

@IonicPage()
@Component({
	selector: 'page-ranking-list',
	templateUrl: 'ranking-list.html'
})
export class RankingListPage {
	@ViewChild(Navbar) navBar: Navbar;

	segment: string;
	
	pollaParticipantList: PollaParticipant[];
	
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public pollaProvider: PollaProvider,
	) {
		this.segment = 'polla';
		
		this.loadRanking();
	}

	ionViewDidLoad() {
		this.navBar.backButtonClick = (e: UIEvent) => {
			this.navCtrl.parent.viewCtrl.dismiss();
		};
	}

	loadRanking() {
		let pollaHeader: PollaHeader = this.navParams.get('pollaHeader');

		this.pollaProvider.getPollaRankingByPollaId(pollaHeader.pollaId).subscribe(
			(res: any) => {
				this.pollaParticipantList = res.body;
			},
			err => {
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	segmentChanged() {

	}
}
