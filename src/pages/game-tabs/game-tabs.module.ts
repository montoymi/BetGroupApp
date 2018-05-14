import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { GameTabsPage } from './game-tabs';

@NgModule({
	declarations: [
		GameTabsPage,
	],
	imports: [
		IonicPageModule.forChild(GameTabsPage),
		TranslateModule.forChild()
	],
	exports: [
		GameTabsPage
	]
})
export class GameTabsPageModule { }

