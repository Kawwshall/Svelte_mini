<script>
	import { createEventDispatcher } from 'svelte';

	export let title = '';
	export let btnType = 'primary'; // Default type
	export let customClass = ''; // User-provided styles
	export let type = 'button'; // Default type for button
	export let btnRef; //Reference for button

	const dispatch = createEventDispatcher();

	function handleClick(e) {
		if (type !== 'submit') {
			e.preventDefault();
		}
		e.stopPropagation();
		dispatch('click', e.detail);
	}

	// Define common styles and type-specific styles
	const commonStyles =
		'px-6 py-2 shadow-sm rounded-[4px] font-medium  capitalize text-sm text-nowrap text-center flex items-center gap-1 disabled:bg-gray-90 disabled:cursor-not-allowed hover:bg-opacity-90';

	const typeStyles = {
		primary: 'text-white bg-primary  ',
		secondary: 'bg-gray-30 border border-gray-50 text-primary font-semibold hover:bg-gray-10',
		danger: 'text-white bg-red-600',
		dangerSecondary: 'text-red-700 bg-red-100 border border-red-300'
	};
</script>

<button
	bind:this={btnRef}
	class={`${commonStyles} ${typeStyles[btnType] || typeStyles['primary']} ${customClass}`}
	on:click={handleClick}
	{type}
	{...$$restProps}
>
	<slot></slot>
</button>
