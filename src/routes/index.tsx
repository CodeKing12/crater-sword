import { Title } from "@solidjs/meta";
import { createAsync, createAsyncStore, query } from "@solidjs/router";
import { batch, createEffect, createMemo, createSignal, onMount } from "solid-js";
import { Combobox, createListCollection } from "~/components/ui/combobox";
import { Text } from "~/components/ui/text";
import { kjvDB, strongLiteDB } from "~/utils/db";
import { BibleRow, BookInfo, StrongLiteRow } from "~/utils/types";
import osis from "~/utils/osis.json";
import booksMeta from "~/utils/books.json";
import { IconButton } from "~/components/ui/icon-button";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-solid";
import { For } from "solid-js";
import { Input } from "~/components/ui/input";
import { Box, Grid, GridItem, Stack } from "styled-system/jsx";
import { Splitter } from "~/components/ui/splitter";
import GeneralCombobox, { ComboboxOptions } from "~/components/custom/GeneralCombobox";
import { createStore, reconcile, StoreSetter } from "solid-js/store";
import { css } from "styled-system/css";
import VerseDisplay from "~/components/custom/VerseDisplay";
import { parseStrongsDefinition } from "~/utils";
import RenderStrongs from "~/components/custom/RenderStrongs";

const getBible = query(async () => {
	"use server";
	return kjvDB.prepare("SELECT * FROM Bible").all() as BibleRow[];
}, "fetch-bible-data");

const getDictionary = query(async () => {
	"use server";
	return strongLiteDB.prepare("SELECT * FROM dictionary").all() as StrongLiteRow[];
}, "fetch-dictionary-data");

interface ScriptureFilter {
	book: BookInfo;
	chapter: number;
	verse: number;
}

interface ScriptureComboData {
	// books: ComboboxOptions[];
	chapters: ComboboxOptions[];
	verses: ComboboxOptions[];
}

export default function Home() {
	const bible = createAsyncStore(() => getBible(), { deferStream: true, initialValue: [] });
	const dictionary = createAsyncStore(() => getDictionary(), { deferStream: true, initialValue: [] });
	const [scriptureFilter, setScriptureFilter] = createStore<ScriptureFilter>({
		book: osis[0],
		chapter: 1,
		verse: 1,
	});

	const booksComboData = () => osis.map((book) => ({ label: book.name, value: book.order.toString(), data: book }));
	const [comboData, setComboData] = createStore<ScriptureComboData>({
		chapters: [],
		verses: [],
	});
	const selectedBookMeta = () => booksMeta.find((bm) => bm.id === scriptureFilter.book.id);

	createEffect(() => {
		setComboData(
			"chapters",
			Array.from({ length: scriptureFilter.book.chapters }, (_, index) => ({
				label: (index + 1).toString(),
				value: (index + 1).toString(),
			}))
		);
	});

	createEffect(() => {
		setComboData(
			"verses",
			Array.from({ length: selectedBookMeta()?.chapters[scriptureFilter.chapter - 1] ?? 0 }, (_, index) => ({
				label: (index + 1).toString(),
				value: (index + 1).toString(),
			}))
		);
	});

	const handleNumberComboboxInputChange = (value: string, all: ComboboxOptions[], setter: (it: ComboboxOptions[]) => void) => {
		setter(all.filter((co) => co.value.startsWith(value)));
	};

	const [filteredBooks, setFilteredBooks] = createStore(booksComboData());

	const broadcast = new BroadcastChannel("projection-info");

	const handleChange = (e: Combobox.InputValueChangeDetails) => {
		const nameLower = e.inputValue.toLowerCase();
		const level1 = booksComboData().filter((book) => book.label.toLowerCase().startsWith(nameLower));
		const level2 = booksComboData().filter((book) => book.label.toLowerCase().includes(nameLower));

		console.log(nameLower, level1, level2, booksComboData());
		const filtered = level1.concat(level2).filter((o, index, arr) => arr.findIndex((item) => JSON.stringify(item) === JSON.stringify(o)) === index);
		// console.log("Here is filtered: ", filtered);
		setFilteredBooks(reconcile(filtered.length > 0 ? filtered : booksComboData()));
	};

	// createEffect(() => {
	// 	console.log("debug book", scriptureFilter.book, scriptureFilter.book.chapters, selectedBookMeta());
	// });
	// createEffect(() => {
	// 	console.log("debug chapter verses", scriptureFilter.chapter, comboData.chapters, scriptureFilter.verse, comboData.verses);
	// });

	const [strongsWord, setStrongsWord] = createSignal("");
	const [currentScripture, setCurrentScripture] = createSignal<BibleRow | undefined>();

	const filterResults = createMemo(() => {
		return bible().filter((row) => row.book === scriptureFilter.book.order && row.chapter === scriptureFilter.chapter);
	});
	const strongsData = () => parseStrongsDefinition(strongsWord(), dictionary().find((row) => row.word === strongsWord())?.data);

	// createEffect(() => {
	// 	console.log(
	// 		strongsWord(),
	// 		strongsData(),
	// 		dictionary().length,
	// 	);
	// });
	onMount(() => {
		document.addEventListener("click", (e) => {
			const target = (e.target as HTMLElement | null)?.closest(".strongs-ref") as HTMLElement; // Or any other selector.
			if (target) {
				if (e.detail === 1) {
					setStrongsWord(target.dataset.ref ?? "");
				} else if (e.detail === 2) {
					const projectionInfo = { scripture: currentScripture(), strongs: strongsData() };
					broadcast.postMessage(projectionInfo);
					localStorage.setItem("projection-info", JSON.stringify(projectionInfo));
				}
				// Do something with `target`.
			}
		});
		// document.querySelectorAll(".strongs-ref").forEach((ref) => {
		// 	ref.addEventListener("click", () => {
		// 		setStrongsWord((ref as HTMLElement).dataset.ref ?? "");
		// 	});
		// 	ref.addEventListener("dblclick", () => {
		// 		const projectionInfo = { scripture: currentScripture(), strongs: strongsData() };
		// 		broadcast.postMessage(projectionInfo);
		// 		localStorage.setItem("projection-info", JSON.stringify(projectionInfo));
		// 	});
		// });
	});

	return (
		<>
			<Title>Crater Sword Project</Title>
			<Splitter.Root maxH="100vh" panels={[{ id: "scripture" }, { id: "strongs" }]}>
				<Splitter.Panel id="scripture">
					<Stack h="100vh" overflow="auto" border="unset" px={3} py={4}>
						<Grid columns={12} mt={2} mb={6}>
							<GridItem colSpan={6}>
								<GeneralCombobox
									data={filteredBooks}
									onInputValueChange={handleChange}
									onValueChange={(dets) => {
										console.log("Setting book: ", dets.items[0]);
										batch(() => {
											setScriptureFilter("book", dets.items[0]?.data);
											setScriptureFilter("chapter", 1);
										});
									}}
									label="Search Scripture"
									inputProps={{ placeholder: "Select a Book", class: css({ textTransform: "capitalize" }) }}
								/>
							</GridItem>
							<GridItem colSpan={3}>
								<GeneralCombobox
									data={comboData.chapters}
									onValueChange={(dets) => {
										console.log("Setting chapter: ", Number(dets.value));
										batch(() => {
											setScriptureFilter("chapter", Number(dets.value));
											setScriptureFilter("verse", 1);
										});
									}}
									label="Search Chapters"
									inputProps={{ placeholder: "Select a Chapter", class: css({ textTransform: "capitalize" }) }}
								/>
							</GridItem>
							<GridItem colSpan={3}>
								<GeneralCombobox
									data={comboData.verses}
									onValueChange={(dets) => {
										console.log("Setting verse: ", Number(dets.value));
										setScriptureFilter("verse", Number(dets.value));
									}}
									label="Search Verses"
									inputProps={{ placeholder: "Select a Verse", class: css({ textTransform: "capitalize" }) }}
								/>
							</GridItem>
						</Grid>

						<Stack gap={4}>
							<For each={filterResults()}>
								{(scripture) => {
									return <VerseDisplay scripture={scripture} />;
								}}
							</For>
						</Stack>
					</Stack>
				</Splitter.Panel>
				<Splitter.ResizeTrigger id="scripture:strongs" />
				<Splitter.Panel id="strongs">
					<Stack w="full" h="100vh" overflow="auto" px={3} py={4}>
						<RenderStrongs data={strongsData()} />
					</Stack>
				</Splitter.Panel>
			</Splitter.Root>
		</>
	);
}
