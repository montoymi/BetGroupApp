import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { BetMatchSavePage } from './bet-match-save';

@NgModule({
	declarations: [
		BetMatchSavePage
	],
	imports: [
		IonicPageModule.forChild(BetMatchSavePage),
		TranslateModule.forChild()
	],
	exports: [
		BetMatchSavePage
	]
})
export class BetMatchSavePageModule {}
