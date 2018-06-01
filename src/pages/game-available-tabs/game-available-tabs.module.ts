import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { GameAvailableTabsPage } from './game-available-tabs';

@NgModule({
	declarations: [
		GameAvailableTabsPage
	],
	imports: [
		IonicPageModule.forChild(GameAvailableTabsPage),
		TranslateModule.forChild()
	],
	exports: [
		GameAvailableTabsPage
	]
})
export class GameAvailableTabsPageModule {}
