import { Plugin } from 'obsidian';
import {DEFAULT_SETTINGS, ToggleCheckboxPlusSettings} from "./togglecheckbox-Settings";
import {ToggleCheckboxPlusSettingsTab} from "./togglecheckbox-SettingsTab";
import ToggleCheckboxPlus from "./togglecheckbox-ToggleChecbox";

export default class ToggleCheckboxPlusPlugin extends Plugin {
	settings: ToggleCheckboxPlusSettings
	toggleCheckboxPlus: ToggleCheckboxPlus

	async onload() {
		console.log('Loading Toggle Checkbox Plus plugin');
		await this.loadSettings();

		this.toggleCheckboxPlus = new ToggleCheckboxPlus(this);
		this.addSettingTab(new ToggleCheckboxPlusSettingsTab(this.app, this, this.toggleCheckboxPlus));

		this.addCommand({
			id: 'better-toggle-checkbox',
			name: 'Toggle checkbox state',
			callback: () => this.toggleCheckboxPlus.toggleCheckboxState(),
			hotkeys: [
				{
					modifiers: ['Mod'],
					key: 'm',
				},
			],
		});
	}

	onunload() {
		console.log('Unloading Toggle Checkbox Plus plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
