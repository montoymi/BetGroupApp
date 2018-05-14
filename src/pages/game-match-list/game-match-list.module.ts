import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { GameMatchListPage } from './game-match-list';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
	declarations: [
		GameMatchListPage
	],
	imports: [
		IonicPageModule.forChild(GameMatchListPage),
		TranslateModule.forChild(),
		PipesModule
	],
	exports: [
		GameMatchListPage
	]
})
export class GameMatchListPageModule {}
