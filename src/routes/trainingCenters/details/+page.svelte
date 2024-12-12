<script>
	import { page } from '$app/stores';
	import { String_Constants } from '/src/config/constants.js';
	import TCDetailsOverview from '$lib/trainingCenters/tcDetails/TcDetailsOverview.svelte';
	import TcDetailsFilters from '$lib/trainingCenters/tcDetails/TcDetailsFilters.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import ListingTable from '$lib/components/ListingTable.svelte';
	import DeletionModalViaAPI from '$lib/components/DeletionModalViaAPI.svelte';
	import InputField from '$lib/components/InputField.svelte';
	import { goto } from '$app/navigation';
	import SuccessMessage from '$lib/components/SuccessMessage.svelte';
	import { message } from '/src/routes/courses/courseStore.js';
	import Button from '$lib/components/Button.svelte';

	// get data from page.js
	export let data;
	let { tcCourseDetailsData, courseList, tcDetailsData } = data;

	// table data for courses under this rseti
	let tableData = [];
	let searchValue = '';

	// for deletion modal
	let viewModal = false;
	let deleteTextConfirmation = false;
	const deletionConfirmText = 'Please delete this course';
	let deleteTextInput = '';
	let courseCode = '';
	let courseName = '';
	let courseUUID = '';

	// details about rseti from the URL params
	let tcFromParams = $page.url.searchParams.get('data');
	let tcDetails = tcDetailsData;

	// create a list of all courses options from the courses list
	let rsetiFilterList = [
		{ uuid: 0, title: String_Constants.ALL_COURSES },
		...Object.values(courseList)
	];
	let courseFilterValue = String_Constants.ALL_COURSES;

	let error = tcCourseDetailsData?.error ? tcCourseDetailsData?.error : '';
	let langauageSelected = 'en';
	// TODO Hook logic to change language

	function sendSearchValueToDatatable(e) {
		searchValue = e.detail;
	}
	if (tcCourseDetailsData && tcCourseDetailsData.length > 0) {
		tcCourseDetailsData.forEach((tc) => {
			let courseKey = tc?.courseUuid?.trim()?.toLowerCase() || ''; // Normalize courseKey

			// Convert courseList to an array of values and find the matching course
			let matchingCourse = Object.values(courseList).find((course) => {
				return course.uuid?.trim()?.toLowerCase() === courseKey;
			});

			let tcObj = {
				uuid: matchingCourse?.uuid,
				name: matchingCourse?.title || '-', // Default to "-" if title is missing
				startDate: `${tc?.startMonth ?? '-'} / ${tc?.startYear ?? '-'}`, // Default to "-" if any data is missing
				endDate: `${tc?.endMonth ?? '-'} / ${tc?.endYear ?? '-'}`, // Default to "-" if any data is missing
				// status: matchingCourse?.status || '-',
				traineesGraduated: tc?.rseti?.traineesGraduated || '-',
				courseCode: matchingCourse?.courseCode ?? '-',
				rsetiUuid: tc?.rsetiUuid
			};

			tableData.push(tcObj);
		});
	}

	async function handleCourseFilter(event) {
		// TODO write logic for filtering statistics
	}

	// -- deletion functions
	function handleCancel() {
		deleteTextInput = '';
		viewModal = false;
	}

	function handleCourseDeletion(e) {
		message.set('');

		// This function will run if deletion is successful
		deleteTextInput = '';

		// remove the data of the deleted entry
		tableData = tableData.filter((data) => data.uuid !== courseUUID);
		// invalidate('rseti:all-rsetis');
		let courseToDelete = Object.values(courseList).find((course) => course.uuid === courseUUID);

		if (courseToDelete) {
			message.set(`Successfully deleted the course ${courseToDelete.title}!`);
		}
	}

	// Function to check if input matches the required text
	$: isTextValid(deleteTextInput);
	function isTextValid() {
		deleteTextConfirmation = deleteTextInput.trim() === deletionConfirmText.trim();
	}

	// --- Courses Table Config Objects
	let tableHeaderDisplay = [
		{
			key: 'name',
			name: 'Name'
		},
		{
			key: 'traineesGraduated',
			name: 'Number of Students'
		},
		{
			key: 'startDate',
			name: 'Planned Date'
		}
	];

	let actionConfigObject = [
		{
			actionName: 'view',
			actionIconName: 'visibility',
			goto: '/trainingCenters/details/viewDetails',
			modal: true
		},
		{
			actionName: 'edit',
			actionIconName: 'edit',
			goto: '/trainingCenters/details/editCourse',
			dispatch: false
		},
		{
			actionName: 'delete',
			actionIconName: 'delete',
			goto: '',
			modal: true
		}
	];

	function handleTableAction(event) {
		message.set('');
		let data = event.detail?.actionData;
		if (event.detail?.actionName === 'delete') {
			viewModal = true;
			courseCode = data.courseCode;
			courseUUID = data.uuid;
			courseName = data.name;
		}
	}

	function handleBulkUploadCoursesUnderTC() {
		goto(`/trainingCenters/details/${tcDetailsData?.uuid}/courses/bulkUpload`);
	}
	function handleSuccesMessageClose(e) {
		message.set('');
	}
</script>

{#if $message}
	<SuccessMessage
		successMessage={$message}
		on:handleSuccessMessageClose={handleSuccesMessageClose}
	/>
{/if}
<!-- <AboutCourseCard {course} /> -->

<!-- <div class="mt-4 mb-4">
	<TcDetailsFilters
		courseFilterOptionList={rsetiFilterList}
		on:handleFilters={handleCourseFilter}
		bind:courseFilterValue
	/>
</div> -->
<div class=" mb-4">
	<TCDetailsOverview {tcDetails} bind:langauageSelected />
</div>
<div class=" mb-4">
	<h2 class="text-darkGray font-semibold">Courses ({tableData?.length ?? 0})</h2>
	<div class="mt-5">
		<div class="mb-5 flex gap-2">
			<SearchBar
				on:handleSearchValue={sendSearchValueToDatatable}
				placeholder={'Search by course'}
				showSearchButton={false}
			/>
			<Button btnType="secondary" on:click={handleBulkUploadCoursesUnderTC}
				>Bulk Upload Courses</Button
			>
			<Button>
				<a
					href={'/trainingCenters/details/addCourse?data=' +
						encodeURIComponent(JSON.stringify(tcDetails))}>+ Add course</a
				>
			</Button>
		</div>
	</div>

	<ListingTable
		{tableHeaderDisplay}
		{actionConfigObject}
		{searchValue}
		{tableData}
		on:tableActionClick={handleTableAction}
	/>
	<!-- <CourseListingTable {searchValue} {tableData} /> -->
</div>
{#if viewModal}
	<DeletionModalViaAPI
		id={''}
		queryParams={encodeURIComponent(JSON.stringify({ uuid: courseUUID }))}
		name={courseName}
		code={courseCode}
		heading={`About to delete the course - ${courseName}`}
		para={'Are you sure you want to delete the course? This action cannot be undone.'}
		endPoint={`/apis/trainingCenters/courses/${tcDetails.uuid}?data=`}
		{deleteTextConfirmation}
		on:handleCancelDeletion={handleCancel}
		on:handleDeletion={handleCourseDeletion}
	>
		<hr />
		<div class=" flex flex-col gap-2 p-6">
			<div>
				<p class="text-sm text-darkGray capitalize">Title : {courseName}</p>
				<p class="text-sm text-darkGray">ID : {courseCode}</p>
			</div>
		</div>
		<hr class="mb-2" />
		<div class="">
			<InputField
				label={"Type 'Please delete this course' to confirm"}
				placeholder={" Type 'Please delete this course'"}
				name={'deletion'}
				labelFontWeight={'font-normal'}
				bind:value={deleteTextInput}
				required
			/>
		</div>
	</DeletionModalViaAPI>
{/if}
