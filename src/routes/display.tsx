import { Title } from "@solidjs/meta";
import { onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { Box, Grid, GridItem, Stack } from "styled-system/jsx";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Field } from "~/components/ui/field";
import { Text } from "~/components/ui/text";
import { StrongsDefinition } from "~/utils/types";

const tempStrongs = [];

interface DisplayData {
	strongs?: StrongsDefinition;
}

export default function DisplayStrongs() {
	const [display, setDisplay] = createStore<DisplayData>({});

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

	return (
		<Box w="100vw" h="100vh" overflow="hidden" bg="black">
			<Title>Display Scripture</Title>

			<Stack h="full" px={16} py={8} gap={10}>
				<Grid columns={3} gap={10}>
					<GridItem w="full">
						<Card.Root width="sm">
							<Card.Header>
								<Card.Title mb={2}>Original</Card.Title>
								<Card.Description fontSize="2xl">{display.strongs?.original}</Card.Description>
							</Card.Header>
						</Card.Root>
					</GridItem>

					<GridItem w="full">
						<Card.Root width="sm">
							<Card.Header>
								<Card.Title mb={2}>Transliteration</Card.Title>
								<Card.Description fontSize="2xl">{display.strongs?.transliteration}</Card.Description>
							</Card.Header>
						</Card.Root>
					</GridItem>

					<GridItem w="full">
						<Card.Root width="sm">
							<Card.Header>
								<Card.Title mb={2}>Phonetic</Card.Title>
								<Card.Description fontSize="2xl">{display.strongs?.phonetic}</Card.Description>
							</Card.Header>
						</Card.Root>
					</GridItem>
				</Grid>

				<Grid flex="1 1 0%" columns={2} gap={10}>
					<GridItem w="full" h="full">
						<Card.Root width="full" h="full">
							<Card.Header>
								<Card.Title mb={2}>Strong's Definition</Card.Title>
								<Card.Body>
									<Text color="black" fontSize="3xl" lineHeight="relaxed">
										{display.strongs?.strongsDefinition}
									</Text>
								</Card.Body>
							</Card.Header>
						</Card.Root>
					</GridItem>

					<GridItem w="full" h="full">
						<Card.Root width="full" h="full">
							<Card.Header>
								<Card.Title mb={2}>Thayer's Definition</Card.Title>
								<Card.Body>
									<Text color="black" fontSize="3xl" lineHeight="relaxed" innerHTML={display.strongs?.definition}></Text>
								</Card.Body>
							</Card.Header>
						</Card.Root>
					</GridItem>
				</Grid>
			</Stack>
		</Box>
	);
}
