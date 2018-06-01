import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { GameAvailableTab1Root } from '../pages';
import { GameAvailableTab2Root } from '../pages';
import { GameAvailableTab3Root } from '../pages';
import { GameAvailableTab4Root } from '../pages';
import { GameAvailableTab5Root } from '../pages';

@IonicPage()
@Component({
	selector: 'page-game-available-tabs',
	templateUrl: 'game-available-tabs.html'
})
export class GameAvailableTabsPage {
	tab1Root: any = GameAvailableTab1Root;
	tab2Root: any = GameAvailableTab2Root;
	tab3Root: any = GameAvailableTab3Root;
	tab4Root: any = GameAvailableTab4Root;
	tab5Root: any = GameAvailableTab5Root;

	tab1Title = ' ';
	tab2Title = ' ';
	tab3Title = ' ';
	tab4Title = ' ';
	tab5Title = ' ';
	tab6Title = ' ';

	tabParams;

	constructor(public navCtrl: NavController, public navParams: NavParams, public translateService: TranslateService) {
		translateService.get(['GAME_INFO_TAB', 'PARTICIPANTS_TAB', 'INVITE_TAB', 'REGISTER_TAB', 'AWARDS_TAB']).subscribe(values => {
			this.tab1Title = values['GAME_INFO_TAB'];
			this.tab2Title = values['PARTICIPANTS_TAB'];
			this.tab3Title = values['INVITE_TAB'];
			this.tab4Title = values['REGISTER_TAB'];
			this.tab5Title = values['AWARDS_TAB'];
		});

		this.tabParams = { pollaHeader: this.navParams.get('pollaHeader') };
	}
}
