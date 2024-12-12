<script>
	import { page } from '$app/stores';
    import AddNarForm from '$lib/nar/addNar/AddNarForm.svelte';

	export let data;
</script>

<AddNarForm route={$page.route.id} params={$page.params} stateData={data?.stateData}/>