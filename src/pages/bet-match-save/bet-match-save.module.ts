import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { BetMatchSavePage } from './bet-match-save';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
	declarations: [
		BetMatchSavePage
	],
	imports: [
		IonicPageModule.forChild(BetMatchSavePage),
		TranslateModule.forChild(),
		PipesModule
	],
	exports: [
		BetMatchSavePage
	]
})
export class BetMatchSavePageModule {}
