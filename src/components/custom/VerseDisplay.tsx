import { Flex } from "styled-system/jsx";
import { BibleRow } from "~/utils/types";
import { Text } from "../ui/text";
import { processVerseText } from "~/utils";

interface Props {
	scripture: BibleRow;
}

export default function VerseDisplay(props: Props) {
	return (
		<Flex gap={3}>
			<Text>{props.scripture.verse}</Text>
			<Text color="black.a10" fontSize="lg" lineHeight={1.6} innerHTML={processVerseText(props.scripture.text)}></Text>
		</Flex>
	);
}
