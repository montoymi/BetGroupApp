import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { GameAvailableDetailPage } from './game-available-detail';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
	declarations: [
		GameAvailableDetailPage
	],
	imports: [
		IonicPageModule.forChild(GameAvailableDetailPage),
		TranslateModule.forChild(),
		PipesModule
	],
	exports: [
		GameAvailableDetailPage
	]
})
export class GameAvailableDetailPageModule {}
