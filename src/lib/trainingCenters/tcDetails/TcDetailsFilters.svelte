<script>
	import Filter from '$lib/components/Filter.svelte';
	import { createEventDispatcher } from 'svelte';
	// Constants for value of select all filter option
	import { String_Constants } from '/src/config/constants.js';

	// set default filter values to select all value of that filter
	export let courseFilterValue;

	// gets option lists from +page.svelte
	export let courseFilterOptionList = [];

	const dispatch = createEventDispatcher();

	// dipatches event when filters are applied or cleared
	function handleApplyFilter() {
		dispatch('handleFilters', { courseFilter: courseFilterValue });
	}

	function handleClearFilter() {
		courseFilterValue = String_Constants.ALL_COURSES;
		dispatch('handleFilters', { courseFilter: courseFilterValue });
	}

	// configures options for filter component
	const courseFilterConfig = {
		optionNameKey: 'title',
		optionIdKey: 'uuid'
	};
</script>

<div class="relative flex justify-end gap-8">
	<div class=" w-full flex sm:flex-row flex-col sm:gap-5 gap-2 justify-end flex-wrap">
		<Filter
			bind:itemSelected={courseFilterValue}
			optionList={courseFilterOptionList}
			optionListConfigObject={courseFilterConfig}
			addClass="sm:min-w-40 lg:min-w-60"
		/>

		<div class="flex justify-between gap-5">
			<button on:click={handleClearFilter} class="text-sm font-semibold text-secondary"
				>Clear filters</button
			>
			<button
				on:click={handleApplyFilter}
				class="text-sm rounded-[4px] font-semibold text-white bg-primary px-6 py-2"
				>Apply filters</button
			>
		</div>
	</div>
</div>
