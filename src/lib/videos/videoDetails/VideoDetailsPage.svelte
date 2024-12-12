<script>
	import VideoDetails from '$lib/videos/videoDetails/VideoDetails.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';
	import ViewershipChart from './ViewershipChart.svelte';
	import VideoDetailsSkeleton from '$lib/videos/videoDetails/VideoDetailsSkeleton.svelte';

	export let route;
	export let params;
	export let searchParams = '';
	export let videoDetails={}

	$: errorInVideos = videoDetails?.error ? true : false;

</script>

<div class="bg-white rounded-lg">
	<div class="px-4 py-3">
		<BreadCrumbs {route} {params} {searchParams} />
	</div>
	<div class="flex justify-between items-center mt-4">
		<div class="px-4 mb-2 font-semibold">Video Details</div>
	</div>
	<div class="grid sm:grid-cols-2 gap-2">
		{#if !errorInVideos}
			<div class="aspect-auto shadow-lg p-4 mb-4 lg:mb-10">
				<VideoPlayer videoId={videoDetails?.extId} />
				<div class="hidden lg:block bg-white h-10">&nbsp</div>
						<div>
							<div class="mb-4">
								<VideoDetails key={params.id} {videoDetails} {params} />
							</div>
						</div>
			</div>
		{:else}
			<ErrorMessage error={'Failed to fetch video'} />
		{/if}
		<div>
			<ViewershipChart />
		</div>
	</div>
</div>

