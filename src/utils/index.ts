import { StrongsDefinition } from "./types";

export function processVerseText(text: string) {
	// Replace formatting tags with <i> elements
	text = text.replace(/<FI>/g, "<i>").replace(/<Fi>/g, "</i>");

	// Replace WH/WG tokens with clickable spans
	text = text.replace(/<W([HG])(\d+)>/g, '<span class="strongs-ref" data-ref="$1$2"> $1$2</span>');

	// Remove extra spaces around references
	return text.replace(/\s+/g, " ").trim();
}

export function parseStrongsDefinition(html?: string): StrongsDefinition | undefined {
	if (!html) return;
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

	const getSectionContent = (prefix: string): string => {
		const element = Array.from(doc.querySelectorAll("p")).find((p) => p.textContent?.trim().startsWith(prefix));
		console.log(prefix, element);
		if (!element) return "";

		// const strong = element.querySelector('strong');
		return element.textContent?.replace(prefix + ":", "").trim() || "";
	};

	// Extract TWOT/TDNT entry
	const entryElement = Array.from(doc.querySelectorAll("p")).find((p) => p.textContent?.includes("TWOT entry") || p.textContent?.includes("TDNT entry"));
	const entry = entryElement?.textContent?.replace(/.*(TWOT|TDNT) entry:\s*/, "") || "";

	return {
		original: getSectionContent("Original"),
		transliteration: getSectionContent("Transliteration"),
		phonetic: getSectionContent("Phonetic"),
		definition: doc.querySelector("ol")?.outerHTML || "",
		origin: getSectionContent("Origin"),
		entry,
		partOfSpeech: getSectionContent("Part(s) of speech"),
		strongsDefinition: getSectionContent("Strong's Definition"),
	};
}
