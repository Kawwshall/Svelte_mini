
<script>
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import { page } from '$app/stores';
	import ReviewForm from '$lib/components/ReviewForm.svelte';


	let courseDataJson = $page.url.searchParams.get('data');

</script>

<div class="mb-6">
    <BreadCrumbs route={$page.route.id} params={$page.params.id} />
</div>

<h2 class="mb-4 font-semibold">
	View Course 
</h2>

<!-- <div class="mb-2 lg:mb-4 w-full">
	<ReviewForm>
		<div class="flex flex-col gap-3">
			<div>
				<div class="text-base font-semibold">Divya</div>
				<div class="text-sm">ID: RSTI56546</div>
			</div>
			
			<div class="w-3/4">State/UT: Andra</div>
			<div class="w-3/4">Hello</div>
		</div>
	</ReviewForm>
</div> -->