<script>
	import MostViewed from "$lib/components/MostViewed.svelte";
    import IndividualStats from '$lib/components/IndividualStats.svelte';
    import {courseStats} from '$lib/data.js'

</script>
<h1 class="mb-2 font-semibold">Videos</h1>
<div class="flex gap-4 items-stretch ">
    <div class="w-1/2 ">
        <div class="grid grid-cols-2 gap-3">
            {#each courseStats as stats,index(index)}
            <IndividualStats {stats} />
            {/each}
        </div>
    </div>
    <div class="w-1/2 ">
        <div class="mb-2 font-semibold text-sm">Most Viewed</div>
        <MostViewed />
    </div>
</div>
<hr class="border-t border-darkgray">