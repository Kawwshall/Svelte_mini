<script>
	import AboutStateCard from '$lib/states/stateDetails/AboutStateCard.svelte';
	import IndividualStats from '$lib/components/IndividualStats.svelte';
	import { courseStats } from '$lib/data.js';

	export let stateDetailsData;
</script>

<div class="grid grid-cols-2 gap-4">
	<AboutStateCard stateDetails={stateDetailsData} />
	<div class="grid grid-cols-2 gap-3">
		{#each courseStats as stats, index (index)}
			<IndividualStats {stats} />
		{/each}
	</div>
</div>
