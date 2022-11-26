import {App, PluginSettingTab, Setting} from "obsidian";
import ToggleCheckboxPlusPlugin from "./main";
import ToggleCheckboxPlus from "./togglecheckbox-ToggleChecbox";

export class ToggleCheckboxPlusSettingsTab extends PluginSettingTab {
	plugin: ToggleCheckboxPlusPlugin
	toggleCheckboxPlus: ToggleCheckboxPlus

	constructor(app: App, plugin: ToggleCheckboxPlusPlugin, toggleCheckboxPlus: ToggleCheckboxPlus) {
		super(app, plugin);
		this.plugin = plugin;
		this.toggleCheckboxPlus = toggleCheckboxPlus
	}

	display(): any {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Checkbox states')
			.setDesc('List of checkbox states, separated by comma.')
			.addText((text) => {
				text
					.setPlaceholder("x,/,-,...")
					.setValue(this.plugin.settings.checkboxStates)
					.onChange(async (value) => {
						this.toggleCheckboxPlus.updateSettings(value);
						await this.plugin.saveSettings();
					});
			});
	}

}
