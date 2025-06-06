import { Show } from "solid-js";
import { Box } from "styled-system/jsx";
import { StrongsDefinition } from "~/utils/types";

interface Props {
	data?: StrongsDefinition;
}

export default function RenderStrongs(props: Props) {
	return (
		<Box fontSize="xl" lineHeight="normal">
			<Show when={props.data} fallback={<div class="flex items-center justify-center">No data to display</div>}>
				{(definition) => (
					<>
						<div class="strongs-section origin-section">
							<span class="section-label">Original:</span>
							<span class="original-text">{definition().original}</span>
						</div>

						<div class="strongs-section translit-section">
							<span class="section-label">Transliteration:</span>
							<span class="transliteration">{definition().transliteration}</span>
						</div>

						<div class="strongs-section phonetics-section">
							<span class="section-label">Phonetic:</span>
							<span class="phonetic">{definition().phonetic}</span>
						</div>

						<div class="strongs-section definition-section">
							<span class="section-label">Thayer's Definition:</span>
							<div class="definition-list" innerHTML={definition().definition}></div>
						</div>

						<div class="strongs-section etymology-section">
							<span class="section-label">Origin:</span>
							<span class="origin">{definition().origin}</span>
						</div>

						<div class="strongs-section lexicon-section">
							<span class="section-label">Lexicon Entry:</span>
							<span class="entry">{definition().entry}</span>
						</div>

						<div class="strongs-section grammar-section">
							<span class="section-label">Part of Speech:</span>
							<span class="part-of-speech">{definition().partOfSpeech}</span>
						</div>

						<div class="strongs-section strongs-def-section">
							<span class="section-label">Strong's Definition:</span>
							<div class="strongs-def">{definition().strongsDefinition}</div>
						</div>
					</>
				)}
			</Show>
		</Box>
	);
}
