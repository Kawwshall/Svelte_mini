<script>
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import VideoGrid from '$lib/components/VideoGrid.svelte';
	import SearchableComboBox from '$lib/components/SearchableComboBox.svelte';

	const dispatch = createEventDispatcher();
	export let coursesData = [];
	let courseName = '';
	let uuid;
	let course;

	
	function handleCourseId(e) {
		const { selectedItemId, selectedItemName } = e.detail;
		courseName = e.detail.selectedItemName;
		uuid = e.detail.selectedItemId;
		course=coursesData?.filter((course)=>course?.uuid===uuid)
	}

	function handleCourseClearFilter(e) {
		const { selectedItemId, selectedItemName } = e.detail;
		courseName = e.detail.selectedItemName;
		uuid = e.detail.selectedItemId;
	}


</script>

<div class="grid grid-cols-2 mb-4">
	<SearchableComboBox
		options={coursesData}
		label={'Select a course'}
		filterCategory={'courseListing'}
		placeholder={'Select a course'}
		bind:selectedItemName={courseName}
		on:handleDispatchComboBoxData={handleCourseId}
		on:handleDispatchFilterData={handleCourseClearFilter}
	/>
</div>

{#if course}
	<div class="">
		<h1 class="text-darkGray font-semibold capitalize mb-4">{course[0]?.title}</h1>
		<VideoGrid videos={course[0]?.videos} showModuleFilter={false} showAddButton={true} dataToSend={course[0]?.courseCode} urlToRoute={'/videos/add'} searchValue='' showSearchBar={course[0]?.videos?.length>0?true:false}/>
	</div>
{/if}
