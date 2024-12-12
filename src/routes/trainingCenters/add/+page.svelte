<script>
	import Add from '$lib/trainingCenters/addTC/AddForm.svelte';
	import { page } from '$app/stores';
	export let data;
	let { stateData } = data;
	let { bankData } = data;
</script>

<Add {stateData} {bankData} route={$page.route.id} params={$page.params} />
