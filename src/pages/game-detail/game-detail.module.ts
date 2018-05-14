import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { GameDetailPage } from './game-detail';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
	declarations: [
		GameDetailPage
	],
	imports: [
		IonicPageModule.forChild(GameDetailPage),
		TranslateModule.forChild(),
		PipesModule
	],
	exports: [
		GameDetailPage
	]
})
export class GameDetailPageModule {}
