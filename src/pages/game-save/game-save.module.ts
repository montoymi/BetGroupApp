import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { IonicStepperModule } from 'ionic-stepper';

import { GameSavePage } from './game-save';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
	declarations: [
		GameSavePage
	],
	imports: [
		IonicStepperModule,
		IonicPageModule.forChild(GameSavePage),
		TranslateModule.forChild(),
		PipesModule
	],
	exports: [
		GameSavePage
	]
})
export class GameSavePageModule {}
