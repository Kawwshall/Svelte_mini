<script>
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import ListingTable from '$lib/components/ListingTable.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import TCListingOverview from '$lib/trainingCenters/tcListing/TCListingOverview.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import DeletionModalViaAPI from '$lib/components/DeletionModalViaAPI.svelte';
	import InputField from '$lib/components/InputField.svelte';
	import TCDetailsFilters from '$lib/trainingCenters/tcListing/TCDetailsFilters.svelte';
	import { String_Constants } from '/src/config/constants.js';
	import { invalidate } from '$app/navigation';
	import RadioButton from '$lib/components/RadioButton.svelte';
	import SuccessMessage from '$lib/components/SuccessMessage.svelte';
	import { message } from '/src/routes/courses/courseStore.js';
	import Button from '$lib/components/Button.svelte';

	// import {getRsetiResponse} from './data.temp.js'
	let tableData = [];

	let searchValue = '';
	export let data;
	let { tcData, stateData } = data;

	let { bankData } = data;
	// let tcData = getRsetiResponse
	// -- Admin API is not ready and response of reap api is not same hence using dummy data --
	let error = tcData?.error ? tcData?.error : '';
	let viewModal = false;
	let rsetiName = '';
	let rsetiId = '';
	let rsetiUUID = '';

	let email = '';
	let tableActionName = '';
	let phone = '';
	let totalCourses = '';
	let traineesGraduated = '';
	let deleteTextInput = '';
	let deletionConfirmText = 'Please delete this rseti';
	let deleteTextConfirmation = false;
	// Extracting state filter option list from stateData
	let stateFilterOptionList = [
		{ title: String_Constants.ALL_STATES, uuid: 0 },
		...stateData
			.filter((state) => state.languageCode === 'en' && state.name && state.extId) // Filter by languageCode and valid name/extId
			.map((state) => ({
				title: state.name.trim(),
				uuid: state.extId
			}))
	];

	let fundingFilterOptionList = [{ title: String_Constants.ALL_FUNDING_GROUPS, uuid: 0 }];
	let stateFilterValue = stateData?.[0]?.title ?? '';

	let fundingFilterValue = fundingFilterOptionList[0].title;
	let selectedLanguage = 'en';

	function sendSearchValueToDatatable(e) {
		searchValue = e.detail;
	}

	// ... existing imports and variables

	function updateTableDataLanguage(language) {
		tableData = [];
		tcData?.forEach((tc) => {
			const fundedByBank = bankData.find((bank) => bank.uuid === tc?.bankId)?.name || '-';
			const translation = tc?.translations?.find(
				(t) => t?.languageCode?.toLowerCase().trim() === language?.toLowerCase().trim()
			);

			const stateName =
				stateData.find(
					(state) => parseInt(state.extId) === tc?.stateId && state.languageCode === language
				)?.name || '-';

			if (translation) {
				// Ensure we only include translations for the selected language
				tableData.push({
					uuid: tc?.uuid,
					extId: tc?.extId,
					name: translation?.name || '-',
					email: tc?.email,
					stateTitle: stateName,
					contactNo: tc?.contactNo,
					address: translation?.address || '-',
					fundedBy: fundedByBank,
					status: '-',
					totalCourses: tc?.courseCount,
					approvedOn: 'Dummy Date'
				});
			}
		});
	}

	function handleLanguageSelectionFromRadioButton(e) {
		selectedLanguage = e.detail;
		updateTableDataLanguage(selectedLanguage);
	}

	// Initialize table data for the default selected language
	$: updateTableDataLanguage(selectedLanguage);

	// ... remaining code

	function handleTableAction(e) {
		message.set('');
		viewModal = e.detail.viewModal;
		tableActionName = e.detail.actionName;
		rsetiName = e.detail.actionData.name;
		rsetiUUID = e.detail.actionData?.uuid;
		rsetiId = e.detail.actionData?.extId;
		email = e.detail.actionData.email;
		phone = e.detail.actionData.phone;
		totalCourses = e.detail.actionData.totalCourses;
		traineesGraduated = e.detail.actionData.traineesGraduated;
	}

	// Function to check if input matches the required text
	$: isTextValid(deleteTextInput);
	function isTextValid() {
		deleteTextConfirmation =
			deleteTextInput.trim().toLowerCase() === deletionConfirmText.trim().toLowerCase();
	}

	function handleCancel() {
		deleteTextInput = '';
		viewModal = false;
	}

	function handleCourseDeletion(e) {
		message.set('');

		// This function will run if deletion is successful
		deleteTextInput = '';

		// remove the data of the deleted entry
		tableData = tableData.filter((data) => data.uuid !== e.detail);
		const deletedTC = tcData.find((tc) => tc.uuid === e.detail);

		if (deletedTC) {
			let deletedRsetiName = '';
			if (deletedTC.translations?.length > 0) {
				deletedRsetiName = deletedTC.translations?.find(
					(item) => item.languageCode == selectedLanguage
				);
			}
			rsetiName = deletedRsetiName.name;
			message.set(`Successfully deleted the training center ${rsetiName}!`);
		}
		invalidate('rseti:all-rsetis');
	}
	let tableHeaderDisplay = [
		{
			key: 'name',
			name: 'Name',
			width: '25%'
		},
		{
			key: 'stateTitle',
			name: 'State',
			width: '25%'
		},
		{
			key: 'fundedBy',
			name: 'Funded by',
			width: '25%'
		},

		{
			key: 'totalCourses',
			name: 'Course Cnt'
		},

		{
			key: 'status',
			name: 'Status'
		}
	];

	let sortAccordingTo = {
		header: null,
		entityType: null,
		sortingOrder: null
	};

	let actionConfigObject = [
		{
			actionName: 'view',
			actionIconName: 'visibility',
			goto: 'trainingCenters/details',
			modal: false
		},
		{
			actionName: 'edit',
			actionIconName: 'edit',
			goto: 'trainingCenters/edit',
			dispatch: false
		},
		{
			actionName: 'delete',
			actionIconName: 'delete',
			goto: '',
			modal: true
		}
	];

	function handleGoToCourse() {
		goto('/trainingCenters/add');
	}

	function handleFilter(e) {}

	function handleBulkUploadTrainingCenters() {
		goto(`/trainingCenters/bulkUpload`);
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

<div class="mb-8 mt-4">
	<!-- <TCDetailsFilters
		{stateFilterOptionList}
		{fundingFilterOptionList}
		on:handleFilters={handleFilter}
		bind:stateFilterValue
		bind:fundingFilterValue
	/> -->
	<div class="mb-8">
		<h1 class="mb-2 heading-L">Training Centers</h1>
		<RadioButton
			languageOptionOne={'english'}
			languageCodeOne={'en'}
			languageOptionTwo={'hindi'}
			languageCodeTwo={'hi'}
			on:handleLanguageFromRadioButton={handleLanguageSelectionFromRadioButton}
		/>
	</div>
	<TCListingOverview />
</div>
<hr class="horizontal-line my-8" />
<div class="mt-5">
	<div class="mb-5 flex gap-2 md:flex-nowrap flex-wrap">
		<SearchBar
			on:handleSearchValue={sendSearchValueToDatatable}
			placeholder={'Search by name or state'}
			showSearchButton={false}
		/>
		<div class="flex gap-2 ml-auto">
			<Button btnType="secondary" on:click={handleBulkUploadTrainingCenters}>Bulk Upload</Button>
			<Button on:click={handleGoToCourse}>+ Training Center</Button>
		</div>
	</div>
	<ListingTable
		{tableHeaderDisplay}
		{sortAccordingTo}
		{actionConfigObject}
		{searchValue}
		{tableData}
		on:tableActionClick={handleTableAction}
	/>
	<!-- <ListingTable {searchValue} {tableData} on:tableActionClick={handleTableAction} /> -->
</div>
{#if viewModal}
	<DeletionModalViaAPI
		id={rsetiUUID}
		name={rsetiName}
		code={rsetiId}
		heading={`About to delete the rseti - ${rsetiName}`}
		para={'Are you sure you want to delete the rseti? This action cannot be undone.'}
		endPoint={'/apis/trainingCenters/'}
		{deleteTextConfirmation}
		on:handleCancelDeletion={handleCancel}
		on:handleDeletion={handleCourseDeletion}
	>
		<hr />
		<div class=" flex flex-col gap-2 p-6 bg-white rounded-lg border border-gray-50 mb-4">
			<div>
				<p class="text-sm text-darkGray capitalize">
					<span class="label">Title : </span>
					{rsetiName}
				</p>
				<p class="text-sm text-darkGray"><span class="label">RSETI Id :</span> {rsetiId}</p>
			</div>
		</div>

		<div class="">
			<InputField
				label={"Type 'Please delete this rseti' to confirm"}
				placeholder={" Type 'Please delete this rseti'"}
				name={'deletion'}
				labelFontWeight={'font-normal'}
				bind:value={deleteTextInput}
				required
			/>
		</div>
	</DeletionModalViaAPI>
{/if}
