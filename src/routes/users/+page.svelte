<script>
	import { goto } from '$app/navigation';
	import ListingTable from '$lib/components/ListingTable.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import DeletionModalViaAPI from '$lib/components/DeletionModalViaAPI.svelte';
	import InputField from '$lib/components/InputField.svelte';

	import {
		narAdminActionConfig,
		narAdminTableHeaderDisplay,
		narTestingData,
		stateAdminActionConfig,
		stateAdminTableHeaderDisplay,
		stateTestingData,
		rsetiAdminActionConfig,
		rsetiAdminTableHeaderDisplay,
		rsetiTestingData
	} from './data';
	let tabs = [
		{
			text: 'narAdmin',
			textDispaly: 'NAR Admin'
		},
		{
			text: 'stateAdmin',
			textDispaly: 'State Admin'
		},
		{
			text: 'rsetiAdmin',
			textDispaly: 'RSETI Admin'
		}
	];
	// $: narFlattenedTestingData = flatternNarData(narTestingData)
	function flattenApiData(apiData) {
		let data = apiData.content;
		let flattenedData = data.map((element) => ({
			name: element.user?.name,
			role: element.user?.role,
			designation: element.user?.designation
		}));
		// console.log("This is flattened data", flattenedData)
		return flattenedData;
	}

	let narFlattenedTestingData = flattenApiData(narTestingData);
	let stateFlattenedTestingData = flattenApiData(stateTestingData);
	let rsetiFlattenedTestingData = flattenApiData(rsetiTestingData);

	let selectedComponent = '';
	let searchValue = '';
	let tableLoading = false;
	let tableData = narFlattenedTestingData;
	let tableHeaderDisplay = narAdminTableHeaderDisplay;
	let actionConfigObejct = narAdminActionConfig;
	let viewDeleteModal = false;
	let userName = '';
	let userRole = '';
	let userDesignation = '';
	let deleteTextInput = '';
	function handleActiveTab(e) {
		// --- Change the selected component to the componet of tab ---
		// console.log("active tab changed to", e.detail)
		selectedComponent = e.detail;

		// --- Change the data for display ---
		if (selectedComponent == tabs[0].text) {
			tableData = narFlattenedTestingData;
			// console.log("table data", tableData)
		}
		if (selectedComponent == tabs[1].text) {
			tableData = stateFlattenedTestingData;
			// console.log("table data", tableData)
		}
		if (selectedComponent == tabs[2].text) {
			tableData = rsetiFlattenedTestingData;
			// console.log("table data", tableData)
		}
	}
	function togglDeleteModal() {
		viewDeleteModal = !viewDeleteModal;
	}
	function handleUserDeletion(e) {
		// TODO handle user deletion when APIs are ready
		if (deleteTextInput !== 'Please delete this user') {
			console.log('Please enter the correct prompt');
		}
		console.log('user delted successfully');
		// viewDeleteModal = false
	}
	function handleSearchValue(e) {
		// ---- passing the search tearm to datatable ----
		searchValue = e.detail;
	}

	function handleAddUser() {
		// ---- navigate to add user page ----
		goto('/users/add');
	}

	function handleBulkUploadUsers() {
		goto('/users/bulkUpload');
	}

	function handleTableActionClick(event) {
		// console.log("this is table click event", event)
		if (event?.detail?.actionName === 'delete') {
			userName = event?.detail?.actionData?.name;
			userRole = event?.detail?.actionData?.role;
			userDesignation = event?.detail?.actionData?.designation || 'CEO';
			togglDeleteModal();
		}
	}
</script>

<div class="flex justify-between items-start mb-8 flex-nowrap">
	<div>
		<h1 class="font-semibold text-base text-primary">Users</h1>
	</div>
</div>
<div class="mb-5">
	<Tabs {tabs} on:handleActiveTab={handleActiveTab} />
</div>

<div class="mb-5 flex gap-2">
	<SearchBar
		on:handleSearchValue={handleSearchValue}
		placeholder={'Search by name'}
		showSearchButton={false}
	/>
	<button
		class="px-6 py-2 font-semibold text-white bg-primary rounded-[4px] capitalize text-sm text-nowrap"
		on:click={handleAddUser}
	>
		+ User
	</button>
	<button
		class="px-6 py-2 font-semibold text-white bg-primary rounded-[4px] capitalize text-sm text-nowrap"
		on:click={handleBulkUploadUsers}
	>
		Bulk Upload
	</button>
</div>

<!-- <svelte:component  this={selectedComponent} /> -->
<ListingTable
	{tableData}
	bind:searchValue
	loading={tableLoading}
	{tableHeaderDisplay}
	actionConfigObject={actionConfigObejct}
	on:tableActionClick={handleTableActionClick}
/>

{#if viewDeleteModal}
	<DeletionModalViaAPI
		id={'pass_user_uuid'}
		name={'pass_user_name'}
		code={'pass_code'}
		heading={'Delete User'}
		para={'Are you sure you want to delete the user? This action cannot be undone.'}
		endPoint={'/apis/user/delete/'}
		on:handleCancelDeletion={togglDeleteModal}
		on:handleDeletion={handleUserDeletion}
	>
		<hr />
		<div class=" flex flex-col gap-2 p-6">
			<div>
				<p class="text-sm text-darkGray capitalize">User : {userName}</p>
				<p class="text-sm text-darkGray">Role : {userRole}</p>
				<p class="text-sm text-darkGray">Designation : {userDesignation}</p>
			</div>
		</div>
		<hr class="mb-2" />
		<div class="">
			<InputField
				label={"Type 'Please delete this user' to confirm"}
				placeholder={" Type 'Please delete this user'"}
				name={'deletion'}
				labelFontWeight={'font-normal'}
				bind:value={deleteTextInput}
				required
			/>
		</div>
	</DeletionModalViaAPI>
{/if}
