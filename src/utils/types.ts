export interface BibleRow {
	book: number;
	chapter: number;
	verse: number;
	text: string;
}

export interface StrongLiteRow {
	relativeOrder: number;
	word: string;
	data: string;
}

export interface StrongsDefinition {
	original: string;
	transliteration: string;
	phonetic: string;
	definition: string;
	origin: string;
	entry: string;
	partOfSpeech: string;
	strongsDefinition: string;
}

export interface BookInfo {
	order: number;
	id: string;
	name: string;
	testament: string;
	start: string;
	abbr: string[];
	chapters: number;
}
