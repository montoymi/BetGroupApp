import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { GameAvailableListPage } from './game-available-list';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
	declarations: [
		GameAvailableListPage
	],
	imports: [
		IonicPageModule.forChild(GameAvailableListPage),
		TranslateModule.forChild(),
		PipesModule
	],
	exports: [
		GameAvailableListPage
	]
})
export class GameAvailableListPageModule {}
