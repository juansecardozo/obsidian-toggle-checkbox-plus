import {Editor, MarkdownView} from "obsidian";
import ToggleCheckboxPlusPlugin from "./main";

export default class ToggleCheckboxPlus {
	private plugin: ToggleCheckboxPlusPlugin
	private states: string[];

	constructor(plugin: ToggleCheckboxPlusPlugin) {
		this.plugin = plugin;
		this.states = ` ,${plugin.settings.checkboxStates}`.split(',');
	}

	toggleCheckboxState() {
		const re =
			new RegExp(
				`(^\\s*|^\\t*)(${this.regexFromList(this.states)}|\\d*\\.\\s|\\*\\s|\\b|^)([^\\n\\r]*)`,
				'gim'
			);
		return this.toggleElement(re, this.replaceCheckboxElement.bind(this));
	}

	private getSelectedText(editor: Editor) {
		if (editor.somethingSelected()) {
			// Toggle checkboxes under the selection
			const cursorStart = editor.getCursor('from');
			const cursorEnd = editor.getCursor('to');
			const content = editor.getRange(
				{line: cursorStart.line, ch: 0},
				{line: cursorEnd.line, ch: editor.getLine(cursorEnd.line).length},
			);

			return {
				start: {line: cursorStart.line, ch: 0},
				end: {
					line: cursorEnd.line,
					ch: editor.getLine(cursorEnd.line).length,
				},
				content: content,
			};
		} else {
			// Toggle the checkbox in the line
			const lineNr = editor.getCursor().line;
			const contents = editor.getDoc().getLine(lineNr);
			const cursorStart = {
				line: lineNr,
				ch: 0,
			};
			const cursorEnd = {
				line: lineNr,
				ch: contents.length,
			};
			const content = editor.getRange(cursorStart, cursorEnd);
			return {start: cursorStart, end: cursorEnd, content: content};
		}
	}

	private toggleElement(re: RegExp, subst: any) {
		const view = this.plugin.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return;

		const editor = view.editor;
		const selection = editor.somethingSelected();
		const selectedText = this.getSelectedText(editor);

		const newString = selectedText.content.replace(re, subst);
		editor.replaceRange(newString, selectedText.start, selectedText.end);

		// Keep cursor in the same place
		if (selection) {
			editor.setSelection(selectedText.start, {
				line: selectedText.end.line,
				ch: editor.getLine(selectedText.end.line).length,
			});
		}
	}

	private regexFromList(list: string[]): string {
		const regexList = list.map((value) => `-\\s\\[${value}]\\s`);
		return regexList.join('|');
	}

	private replaceCheckboxElement(
		match: string,
		backspaces: string,
		startsWith: string,
		text: string,
	) {
		const checkboxList = this.states.map((value) => `- [${value}] `);
		const currentState = checkboxList.indexOf(startsWith);
		const nextState = currentState + 1;

		if (checkboxList[nextState]) {
			return `${backspaces}${checkboxList[nextState]}${text}`;
		}

		return `${backspaces}${checkboxList[0]}${text}`;
	}

	updateSettings(value: string) {
		this.plugin.settings.checkboxStates = value
		this.states = ` ,${value}`.split(',');
	}
}
