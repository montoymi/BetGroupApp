import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, Navbar, ToastController, Refresher } from 'ionic-angular';

import { UserProvider, PollaProvider } from '../../providers/providers';
import { PollaParticipant } from '../../models/polla/polla-participant';
import { PollaHeader } from '../../models/polla/polla-header';
import { presentToast, getFlagValue } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-ranking-list',
	templateUrl: 'ranking-list.html'
})
export class RankingListPage {
	@ViewChild(Navbar) navBar: Navbar;

	segment: string;
	modePollitaFlag: boolean;
	modePollaFlag: boolean;
	
	pollaParticipantList: PollaParticipant[];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public pollaProvider: PollaProvider
	) {
		// Habilita y seleciona el tab segun flags.
		let pollaHeader: PollaHeader = this.navParams.get('pollaHeader');
		this.modePollitaFlag = getFlagValue(pollaHeader.modePollitaFlag) == 1;
		this.modePollaFlag = getFlagValue(pollaHeader.modePollaFlag) == 1;
		this.segment = this.modePollaFlag ? 'polla' : 'pollita';
	}

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

		this.loadRanking(null);
	}

	loadRanking(refresher: Refresher) {
		let pollaHeader: PollaHeader = this.navParams.get('pollaHeader');

		this.pollaProvider.getPollaRankingByPollaId(pollaHeader.pollaId).subscribe(
			(res: any) => {
				if (refresher) refresher.complete();
				this.pollaParticipantList = res.body;
			},
			err => {
				if (refresher) refresher.complete();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	segmentChanged() {}

	openRankingDetailPage(pollaParticipant: PollaParticipant) {
		this.navCtrl.push('RankingDetailPage', { pollaParticipant: pollaParticipant });
	}
}
