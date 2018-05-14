import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { GameListPage } from './game-list';

@NgModule({
	declarations: [
		GameListPage
	],
	imports: [
		IonicPageModule.forChild(GameListPage),
		TranslateModule.forChild()
	],
	exports: [
		GameListPage
	]
})
export class GameListPageModule {}
