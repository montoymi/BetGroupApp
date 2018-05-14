import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { GameBetSavePage } from './game-bet-save';

@NgModule({
	declarations: [
		GameBetSavePage
	],
	imports: [
		IonicPageModule.forChild(GameBetSavePage),
		TranslateModule.forChild()
	],
	exports: [
		GameBetSavePage
	]
})
export class GameBetSavePageModule {}
