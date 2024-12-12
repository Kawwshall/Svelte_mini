
<!-- Design not yet finalised for this part -->
<script>
    import IndividualStats from '$lib/components/IndividualStats.svelte'
    import {courseStats} from '$lib/data.js'

</script>
<h1 class="mb-2 font-semibold">States</h1>
<div class="flex gap-4 items-stretch ">
            {#each courseStats as stats,index(index)}
            <IndividualStats {stats} />
            {/each}
</div>
