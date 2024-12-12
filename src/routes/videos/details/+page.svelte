<script>
	import { page } from '$app/stores';
	import VideoDetailspage from '$lib/videos/videoDetails/VideoDetailsPage.svelte';

	export let data;

	let {videoDetails} = data
	let route = $page.route.id;
	const url = $page.url;
	let searchParams = url.search;
	$: params = $page.params;
</script>

<div class=" mx-8 mt-0 mb-8 lg:mb-9 lg:mt-0 2xl:my-12 2xl:mt-0">
	<VideoDetailspage
		{route}
		{params}
		token={data.token}
		{searchParams}
		{videoDetails}
	/>
</div>
