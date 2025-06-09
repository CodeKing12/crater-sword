import { Title } from "@solidjs/meta";
import { createEffect, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { Box, Grid, GridItem, Stack } from "styled-system/jsx";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Field } from "~/components/ui/field";
import { Text } from "~/components/ui/text";
import { textfill } from "~/utils";
import { fitText } from "~/utils/fittext";
import { StrongsDefinition } from "~/utils/types";
import fitty from "fitty";
import { textFit } from "~/utils/textFit";

const tempStrongs = [];

interface DisplayData {
	strongs?: StrongsDefinition;
}

export default function ProjectUI() {
	const [display, setDisplay] = createStore<DisplayData>({});
	let contentEl: HTMLParagraphElement | undefined;

	const broadcast = new BroadcastChannel("projection-info");
	onMount(() => {
		const info = localStorage.getItem("projection-info");
		if (info) {
			setDisplay("strongs", JSON.parse(info).strongs);
		}
		broadcast.addEventListener("message", (ev) => {
			const message = ev.data;
			setDisplay("strongs", message.strongs);
		});
	});

	createEffect(() => {
		console.log("Dictionary Definition: ", display.strongs?.definition);
		if (contentEl && display.strongs?.definition) {
			textFit(contentEl, display.strongs?.definition);
		}
	});

	onMount(() => {
		// if (contentEl) {
		// 	// fitty(contentEl);
		// 	textFit(contentEl);
		// 	// fitText(contentEl, 10);
		// }
	});

	return (
		<Box w="100vw" h="100vh" overflow="hidden" bg="black">
			<Title>Project Scripture</Title>

			<Stack color="white" h="full" px={16} py={8} justifyContent="center" alignItems="center">
				<Text class="stable-text heading" mb={5} fontWeight="bold" color="yellow">
					Thayer's Definition
				</Text>
				<Text display="block" mb={5} w="full" h="full" fontSize="" max-font-size="200px" min-font-size="10px" overflow="auto" ref={contentEl}></Text>
				<Text class="stable-text heading" fontWeight="bold" color="yellow">
					{display.strongs?.word}
				</Text>
			</Stack>
		</Box>
	);
}
