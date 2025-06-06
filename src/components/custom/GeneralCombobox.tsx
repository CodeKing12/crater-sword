import { CheckIcon, ChevronsUpDownIcon } from "lucide-solid";
import { Combobox, createListCollection } from "../ui/combobox";
import { IconButton } from "../ui/icon-button";
import { createEffect, createMemo, createSignal, For } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import { Input } from "../ui/input";
import { ComboboxInputProps, ComboboxInputValueChangeDetails, ComboboxRootProps } from "@ark-ui/solid";
import { css } from "styled-system/css";

export interface ComboboxOptions {
	label: string;
	value: string;
	data?: any;
	[misc: string]: any;
}

interface Props extends Omit<ComboboxRootProps<ComboboxOptions>, "collection"> {
	label: string;
	inputProps?: ComboboxInputProps;
	data: ComboboxOptions[];
	onInputValueChange?: (dets: ComboboxInputValueChangeDetails) => void;
}

export default function GeneralCombobox(props: Props) {
	const [items, setItems] = createSignal<ComboboxOptions[]>(props.data);
	const collection = createMemo(() =>
		createListCollection({
			items: items(),
		})
	);

	createEffect(() => {
		// console.log("Updating filtered: ", props.data);
		setItems(props.data);
	});

	return (
		<Combobox.Root inputBehavior="autocomplete" openOnClick={true} defaultHighlightedValue={collection().items[0]?.value.toString()} width="full" onInputValueChange={props.onInputValueChange} collection={collection()} {...props}>
			<Combobox.Label>{props.label}</Combobox.Label>
			<Combobox.Control mt={1}>
				<Combobox.Input {...props.inputProps} asChild={(inputProps) => <Input {...inputProps()} />} />
				<Combobox.Trigger
					asChild={(triggerProps) => (
						<IconButton variant="link" aria-label="open" size="xs" {...triggerProps()}>
							<ChevronsUpDownIcon />
						</IconButton>
					)}
				/>
			</Combobox.Control>
			<Combobox.Positioner>
				<Combobox.Content maxH="60vh" overflow="auto">
					<For each={collection().items}>
						{(item) => (
							<Combobox.Item item={item} py={1.5}>
								<Combobox.ItemText>{item.label}</Combobox.ItemText>
								<Combobox.ItemIndicator>
									<CheckIcon />
								</Combobox.ItemIndicator>
							</Combobox.Item>
						)}
					</For>
				</Combobox.Content>
			</Combobox.Positioner>
		</Combobox.Root>
	);
}
