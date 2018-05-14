import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { GameBetListPage } from './game-bet-list';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
	declarations: [
		GameBetListPage
	],
	imports: [
		IonicPageModule.forChild(GameBetListPage),
		TranslateModule.forChild(),
		PipesModule
	],
	exports: [
		GameBetListPage
	]
})
export class GameBetListPageModule {}
