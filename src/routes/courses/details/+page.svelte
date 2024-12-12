<script>
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	import { String_Constants } from '/src/config/constants.js';
	import { chapterSuccessMessage, chapterErrorMessage } from '/src/routes/courses/courseStore.js';
	import { message } from '/src/routes/courses/courseStore.js';
	import CourseDetailsOverview from '$lib/courses/courseDetails/CourseDetailsOverview.svelte';
	import CourseDetailsFilters from '$lib/courses/courseDetails/CourseDetailsFilters.svelte';
	import SyllabusSection from '$lib/courses/courseDetails/SyllabusSection.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import ChaptersListing from '$lib/courses/courseDetails/ChaptersListing.svelte';
	import { tokenExpired } from '/src/stores/store.js';
	import SuccessMessage from '$lib/components/SuccessMessage.svelte';
	import FilterComponent from '$lib/components/FilterComponent.svelte';

	export let data;

	let { stateData, videosData, courseDetailsData, coursesData } = data;
	let showHorizontalLine = videosData?.length > 0 ? true : false;
	let coursesList = [];
	let filterOptions = [];
	let genderData = [
		{ id: '1', name: 'Female' },
		{ id: '2', name: 'Male' },
		{ id: '3', name: 'Trans Gender' }
	];

	$: error = courseDetailsData?.error ? true : false;
	$: if (courseDetailsData.status == 401) {
		tokenExpired.set(true);
	}
	$: if (!coursesData?.error) {
		coursesList = coursesData?.flatMap((course) => {
			if (!course.uuid) return []; // Return early if uuid is missing
			return course.translations
				.filter((translation) => translation.languageCode === 'en')
				.map((translation) => ({
					name: translation.title,
					id: course.uuid,
					videos: course?.videos,
					chapters: course?.chapters
				}));
		});
	}

	$: courseTitle = courseDetailsData?.translations?.find(
		(item) => item.languageCode === 'en'
	)?.title;

		// Preparing the states data for the filter component
		$:{
	if(stateData){
		let formattedFilterArray=[]
		let formattedFilterValues = stateData?.map((item)=>
		{
		let object ={
		id:item?.uuid,
		name:item?.title
		}
		if(Number(item?.uuid) !== 0){
			formattedFilterArray.push(object)
		}
		}
		)
		filterOptions = [{
		filterName:'States',
		filterValue:formattedFilterArray
		}]
		}
		if(genderData){
			filterOptions.push({
			filterName:'Gender',
			filterValue:genderData
			})
		}
	}



	function handleSuccesMessageClose(e) {
		message.set('');
	}

	async function handleFilterApplied(event) {
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

	onMount(() => {
		chapterSuccessMessage.set('');
	});

	onDestroy(() => {
		message.set('');
	});
</script>

{#if $message}
	<SuccessMessage
		successMessage={$message}
		on:handleSuccessMessageClose={handleSuccesMessageClose}
	/>
{/if}

<div class=" mb-4 flex justify-end">
	<FilterComponent
	on:filterApplied={handleFilterApplied}
	btnType='secondary'
	{filterOptions}
/>
</div>
{#if !error}
	<div class="">
		<CourseDetailsOverview courseData={courseDetailsData} {showHorizontalLine} />
	</div>
	<div class=" mt-8 mb-12">
		<!-- <hr class="my-8 horizontal-line" /> -->
		<ChaptersListing
			courseCode={courseDetailsData?.courseCode}
			chaptersData={courseDetailsData?.chapters}
			courseUuid={courseDetailsData?.uuid}
			{coursesList}
			{courseTitle}
		/>
	</div>
	<!-- <hr class="my-8 mx-6" /> -->

	<!-- <div class="mx-6 mb-8">
		<h2 class="text-darkGray font-semibold mb-4">Syllabus</h2>
		<SyllabusSection />
	</div> -->
{:else}
	<ErrorMessage />
{/if}
