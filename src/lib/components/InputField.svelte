<script>
	import { createEventDispatcher } from 'svelte';
	export let value = '';
	export let label = '';
	export let placeholder = '';
	export let name = '';
	export let required = false;
	export let type = '';
	export let readonly = '';
	export let labelFontWeight = 'font-medium';
	export let disabled = false;
	let despatch = createEventDispatcher();

	function handleInputValue(e) {
		value = e.target.value;
		despatch('handleInputData', { name, value });
	}
</script>

<div>
	<label for="input" class="block text-xs sm:text-sm {labelFontWeight}  leading-6 text-darkGray"
		>{label}</label
	>
	<div>
		<input
			{type}
			{name}
			id=" "
			class="block w-full rounded-md border-0 py-2 px-3 sm:py-1.5 sm:px-2 text-darkGray shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-70 outline-none focus:ring-2 focus:ring-inset focus:ring-blue-40 text-xs sm:text-sm sm:leading-6"
			{placeholder}
			on:input={handleInputValue}
			{value}
			{required}
			{readonly}
			{disabled}
			{...$$restProps}
		/>
	</div>
</div>
