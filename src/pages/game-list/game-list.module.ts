import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { GameListPage } from './game-list';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
	declarations: [
		GameListPage
	],
	imports: [
		IonicPageModule.forChild(GameListPage),
		TranslateModule.forChild(),
		PipesModule
	],
	exports: [
		GameListPage
	]
})
export class GameListPageModule {}
