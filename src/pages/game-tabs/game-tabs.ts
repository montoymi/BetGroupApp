import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { GameTab1Root } from '../pages';
import { GameTab2Root } from '../pages';
import { GameTab3Root } from '../pages';
import { GameTab4Root } from '../pages';
import { GameTab5Root } from '../pages';
import { GameTab6Root } from '../pages';

@IonicPage()
@Component({
	selector: 'page-game-tabs',
	templateUrl: 'game-tabs.html'
})
export class GameTabsPage {
	tab1Root: any = GameTab1Root;
	tab2Root: any = GameTab2Root;
	tab3Root: any = GameTab3Root;
	tab4Root: any = GameTab4Root;
	tab5Root: any = GameTab5Root;
	tab6Root: any = GameTab6Root;

	tab1Title = ' ';
	tab2Title = ' ';
	tab3Title = ' ';
	tab4Title = ' ';
	tab5Title = ' ';
	tab6Title = ' ';

	tabParams = { pollaHeader: this.navParams.get('pollaHeader'), myPollas: this.navParams.get('myPollas') };

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public translateService: TranslateService
	) {
		translateService
			.get(['GAME_INFO_TAB', 'PARTICIPANTS_TAB', 'INVITE_TAB', 'EVENTS_TAB', 'RULES_TAB', 'RANKING_TAB'])
			.subscribe(values => {
				this.tab1Title = values['GAME_INFO_TAB'];
				this.tab2Title = values['PARTICIPANTS_TAB'];
				this.tab3Title = values['INVITE_TAB'];
				this.tab4Title = values['EVENTS_TAB'];
				this.tab5Title = values['RULES_TAB'];
				this.tab6Title = values['RANKING_TAB'];
			});

		let myPollas: boolean = this.navParams.get('myPollas');
		if (!myPollas) {
			this.tab1Root = 'GameAvailableDetailPage';
		}
	}
}
