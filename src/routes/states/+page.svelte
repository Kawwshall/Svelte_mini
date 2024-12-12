<script>
	import { goto } from '$app/navigation';
	import { String_Constants } from '/src/config/constants.js';
	import { message } from '/src/routes/states/stateStore.js';
	import Filters from '$lib/states/statesListing/Filters.svelte';
	import ListingTable from '$lib/states/statesListing/ListingTable.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import SuccessMessage from '$lib/components/SuccessMessage.svelte';
	import StateListingOverview from '$lib/states/statesListing/StateListingOverview.svelte';
	import DeletionModalViaAPI from '$lib/components/DeletionModalViaAPI.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import { page } from '$app/stores';

	export let data;

	$: console.log('data', data);

	let searchValue = '';
	let viewModal = false;
	let tableActionName = '';
	let { statesListData, rsetiData, stateData } = data;
	let stateDeletionUUID = '';
	let stateName = '';
	let phoneNumber = '';
	let email = '';
	let tableData = [];
	let stateFilterValue = String_Constants.ALL_STATES;
	let error = statesListData?.error ? coursesData?.error : '';
	let statesListDataEmpty = statesListData?.length === 0 ? true : false;

	function sendSearchValueToDatatable(e) {
		searchValue = e.detail;
	}

	if (!statesListData?.error) {
		statesListData?.forEach((state) => {
			let stateObj = {
				uuid: state?.uuid,
				name: state?.title,
				phoneNumber: state?.phoneno ? state.phoneno.replace(/;/g, ',') : '',
				email: state?.email ? state.email.replace(/;/g, ',') : '',
				address: state?.address
			};
			if (state?.status?.toLowerCase().trim() !== 'deleted') {
				tableData.push(stateObj);
			}
		});
	}
	function handleSuccesMessageClose(e) {
		message.set('');
	}

	function handleTableAction(e) {
		message.set('');
		viewModal = e.detail.viewModal;
		tableActionName = e.detail.actionName;
		stateName = e.detail.actionData.name;
		email = e.detail.actionData.email;
		phoneNumber = e.detail.actionData.phoneNumber;
		stateDeletionUUID = e.detail.actionData.uuid;
	}

	function handleCancel() {
		viewModal = false;
	}

	function handleStateDeletion(e) {
		message.set('State deleted successfully!');
		let filteredStatesData = tableData?.filter((state) => {
			return state?.uuid !== e.detail;
		});
		tableData = filteredStatesData;
	}
	function handleGoToAddState() {
		goto('/states/add');
	}

	function handleBulkUploadStates() {
		goto('/states/bulkUpload');
	}
	async function handleFilter(event) {
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
</script>

{#if !statesListDataEmpty}
	{#if $message}
		<SuccessMessage
			successMessage={$message}
			on:handleSuccessMessageClose={handleSuccesMessageClose}
		/>
	{/if}

	<div class="mt-4 mb-4">
		<Filters
			on:handleFilters={handleFilter}
			bind:stateFilterValue
			stateFilterOptionList={stateData}
		/>
	</div>

	<div class="mb-8 mt-4">
		<StateListingOverview />
	</div>
	<div class="mt-5">
		<div class="mb-5 flex gap-2">
			<SearchBar
				on:handleSearchValue={sendSearchValueToDatatable}
				placeholder={'Search by name'}
				showSearchButton={false}
			/>
			<button
				class="px-6 py-2 font-semibold text-white bg-primary rounded-[4px] capitalize text-sm text-nowrap"
				on:click={handleGoToAddState}
			>
				+ State
			</button>
			<button
				class="px-6 py-2 font-semibold text-white bg-primary rounded-[4px] capitalize text-sm text-nowrap"
				on:click={handleBulkUploadStates}
			>
				Bulk Upload
			</button>
		</div>
		<ListingTable {searchValue} {tableData} on:tableActionClick={handleTableAction} {error} />
	</div>

	<div>
		{#if viewModal && tableActionName === 'delete'}
			<DeletionModalViaAPI
				id={stateDeletionUUID}
				name={stateName}
				heading={'State Deletion'}
				para={'Are you sure you want to delete this state?'}
				endPoint={'/apis/states/delete/'}
				on:handleCancelDeletion={handleCancel}
				on:handleDeletion={handleStateDeletion}
			/>
		{/if}
	</div>
{/if}
