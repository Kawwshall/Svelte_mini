<script>
	import { page } from '$app/stores';
	import { String_Constants } from '/src/config/constants.js';
	import StateDetailsFilters from '$lib/states/stateDetails/StateDetailsFilters.svelte';
    import StateDetailsOverview from '$lib/states/stateDetails/StateDetailsOverview.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';

	export let data;

	let stateFromParams = $page.url.searchParams.get('data');
	let state = JSON.parse(stateFromParams);
	let {stateData } = data;
	

	let genderData = [
		{ id: 1, name: 'Female' },
		{ id: 2, name: 'Male' },
		{ id: 3, name: 'Trans Gender' }
	];

	let stateFilterValue = String_Constants.ALL_STATES;
	let genderFilterValue = String_Constants.ALL_GENDERS;

	async function handleStateFilter(event) {
		// extracting the filter values from the event
		let stateFilter = event.detail.stateFilter;

		let courses = [];
		// The filter logic is not finalised, the code will be added accordingly
		// 	if (rsetiFilter === String_Constants.ALL_COURSES) {
		// 		courses=coursesData;
		// 	} else {
		// 	loading = false;
		// }
	}
</script>

<!-- <AboutCourseCard {course} /> -->

<div class="mt-2 mb-4 mx-6">
	<div class="mb-2">
		<BreadCrumbs route={$page.route.id} params={$page.params} />
	</div>
	<StateDetailsFilters
		on:handleFilters={handleStateFilter}
		bind:stateFilterValue
		bind:genderFilterValue
		stateFilterOptionList={stateData}
		genderFilterOptionList={genderData}
	/>
</div>

<div class="mx-6 mb-4">
	<StateDetailsOverview stateDetailsData={state}/>
</div>

