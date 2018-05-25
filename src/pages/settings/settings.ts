import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Settings } from '../../providers/providers';

@IonicPage()
@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html'
})
export class SettingsPage {
	// Our local settings object
	options: any;

	settingsReady = false;

	form: FormGroup;

	constructor(
		public navCtrl: NavController,
		public settings: Settings,
		public formBuilder: FormBuilder,
		public navParams: NavParams,
		public translate: TranslateService
	) {}

	// Runs when the page has loaded. This event is NOT fired on
	// entering a view that is already cached.
	// Solo la primera vez que carga la opción y sub opciones.
	ionViewDidLoad() {
		// Build an empty form for the template to render
		this.form = this.formBuilder.group({});
	}

	// Runs when the page is about to enter and become the active page.
	// Cada vez que carga la opción y sub opciones.
	ionViewWillEnter() {
		// Build an empty form for the template to render
		this.form = this.formBuilder.group({});

		this.settings.load().then(() => {
			this.settingsReady = true;
			this.options = this.settings.allSettings;

			this.buildForm();
		});
	}

	buildForm() {
		let group: any = {
			lang: [this.options.lang]
		};

		this.form = this.formBuilder.group(group);

		// Watch the form for changes, and save.
		this.form.valueChanges.subscribe(v => {
			this.settings.merge(this.form.value);
		});
	}

	ngOnChanges() {
		console.log('Ng All Changes');
	}
}
