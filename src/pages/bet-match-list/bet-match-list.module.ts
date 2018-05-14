import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { BetMatchListPage } from './bet-match-list';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
	declarations: [
		BetMatchListPage
	],
	imports: [
		IonicPageModule.forChild(BetMatchListPage),
		TranslateModule.forChild(),
		PipesModule
	],
	exports: [
		BetMatchListPage
	]
})
export class BetMatchListPageModule {}
