import { StrongsDefinition } from "./types";

export function processVerseText(text: string) {
	// Replace formatting tags with <i> elements
	text = text.replace(/<FI>/g, "<i>").replace(/<Fi>/g, "</i>");

	// Replace WH/WG tokens with clickable spans
	text = text.replace(/<W([HG])(\d+)>/g, '<span class="strongs-ref" data-ref="$1$2"> $1$2</span>');

	// Remove extra spaces around references
	return text.replace(/\s+/g, " ").trim();
}

export function parseStrongsDefinition(word: string, html?: string): StrongsDefinition | undefined {
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
		word,
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

export function textfill(element: HTMLElement) {
	const maxFontSizeStr = element.getAttribute("max-font-size") ?? "200px";
	const minFontSizeStr = element.getAttribute("min-font-size") ?? "50px";

	// Parse max font size and extract unit
	let maxFontSizeValue = parseFloat(maxFontSizeStr);
	const unit = maxFontSizeStr.replace(maxFontSizeValue.toString(), "").trim();

	// Parse min font size (remove unit if present)
	let minFontSizeValue = parseFloat(minFontSizeStr.replace(unit, "").trim());

	let fontSize = Math.floor((maxFontSizeValue + minFontSizeValue) / 2);
	const parent = element.parentElement;

	const maxHeight = parent.clientHeight;
	const maxWidth = parent.clientWidth;

	let textHeight, textWidth;

	do {
		element.style.fontSize = `${fontSize}${unit}`;

		// Get dimensions after font size change
		textHeight = element.clientHeight;
		textWidth = element.clientWidth;

		if (textHeight > maxHeight || textWidth > maxWidth) {
			// Too big - decrease font size
			maxFontSizeValue = fontSize;
			fontSize = Math.floor((fontSize + minFontSizeValue) / 2);
		} else if (textHeight < maxHeight || textWidth < maxWidth) {
			// Too small - increase font size
			minFontSizeValue = fontSize;
			fontSize = Math.floor((fontSize + maxFontSizeValue) / 2);
		} else {
			// Perfect fit
			break;
		}
	} while (maxFontSizeValue - minFontSizeValue > 1 && maxFontSizeValue > minFontSizeValue);

	// Apply final font size
	element.style.fontSize = `${fontSize}${unit}`;
}

function resizeText() {
	// document.querySelectorAll(".textfill").forEach(textfill);
}

// Initialize on load and resize
// document.addEventListener("DOMContentLoaded", resizeText);
// window.addEventListener("resize", resizeText);
