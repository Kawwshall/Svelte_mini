<script>
	import Select from '$lib/components/Select.svelte';
	import { error } from '@sveltejs/kit';
	import GoogleMatrialIcon from './GoogleMatrialIcon.svelte';
	import { createEventDispatcher } from 'svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';

	export let showPagination = true;
	export let tableStyle = 'primary';
	export let notFoundMessage;

	//------------ Datatable Component Usage---------------------------
	// The datatable component handles searching, sorting and pagination
	// tableHeaderDisplay property is a necessary property
	// To customize the header names user can pass the tableHeaderDisplay property in the following format
	// {key: name_of_header_in_data, name: custom_header_name}
	// The data need not be trimmed before passing as only fields that are specidied in the tableHeaderDisplay will be rendered
	// Sorting takes into account the type of data hence string data and integer data are sorted seperately
	// SortAccordingTo state can also be taken as a prop and bindied so that the sorting state is preserved when we reload the datatable

	//------------- WARNING! -----------------------
	// If a numerical data comming in string format, example "1" instead of 1, the user (of this component) will need to first parse them
	// into integer format and then pass the data to the datatable component if they want correct sorting behaviour

	// passed mapping of custom header name and its key
	// [{key: name_of_header_in_data, name: custom_header_name}]
	// The key property should be string that is the key in the actual data
	export let tableHeadersDisplay;

	// This is the action config object to define how the action tab of the datatable should look
	// actionName: it is the name of the action that will be passed to the screen reader
	// actionIconName: Google Material Icon name which should be displayed for the action
	export let actionConfigObject = [
		// {
		// 	actionName: 'dummy action',
		// 	actionIconName: ''
		// }
	];
	$: tableHeadersDisplay = calculateWidths(tableHeadersDisplay);

	function calculateWidths(elements) {
		//this function divides the table columns based on the user specified widths
		//width is passed through tableHeadersDisplay
		//NOTE: If no width is specified, all columns will be of equal width
		let totalSpecifiedWidth = 0;
		let unsetCount = 0;

		// Calculate the total specified width and count columns without specified widths
		for (const element of elements) {
			if (element.width) {
				totalSpecifiedWidth += parseFloat(element.width);
			} else {
				unsetCount++;
			}
		}

		// Case 1: Specified widths exceed 100%
		if (totalSpecifiedWidth > 100) {
			// Scale down each specified width proportionally
			const scalingFactor = 100 / totalSpecifiedWidth;
			elements = elements.map((element) => ({
				...element,
				width: element.width ? `${parseFloat(element.width) * scalingFactor}%` : null
			}));
		} else {
			// Case 2: Specified widths are less than or equal to 100%
			const remainingWidth = 100 - totalSpecifiedWidth;

			const equalWidth = remainingWidth / unsetCount;
			// Assign equal width to columns without specified widths
			elements = elements.map((element) => ({
				...element,
				width: element.width ? `${element.width}` : `${equalWidth}%`
			}));
		}

		return elements;
	}

	// When an action is clicked in the action tab an event is dispatched to the parent component
	// the event contains the name of the action that was clicked and the data associated with that row
	const dispatch = createEventDispatcher();
	function handleActionDispatch(actionName, actionData, viewModal) {
		dispatch('tableActionClick', { actionName, actionData, viewModal });
	}

	// throw an error if its missing
	if (!tableHeadersDisplay) {
		error(404, {
			message: "Missing necessary property 'tableHeaderDisplay' in datatable component"
		});
	}

	// main data for the table
	export let tableData = [
		{
			name: 'dummyname',
			email: 'dummyemail',
			phone: 'dummyphone'
		}
	];

	export let entriesPerPage = 10;
	export let searchValue = '';
	export let rowHeight = 'normal';

	let tableDataRender = [];

	// -------Extracting Headers for table from the keys of the first element in the array---------------
	let tableHeaders = Object.keys(tableData[0]);

	// ------------- Search Function -------------
	function updateTableDataRender(searchValue) {
		tableDataRender = tableData?.filter((object) => {
			let isSearched = false;
			const sanitizedSearchValue = searchValue?.toLocaleLowerCase().trim();

			for (let i = 0; i < tableHeadersDisplay?.length; i++) {
				// extract value that is present in the data table
				const value = object[tableHeadersDisplay[i]?.key];

				// check if value has those characters
				if (typeof value == 'string') {
					if (value?.toLocaleLowerCase().includes(sanitizedSearchValue)) {
						isSearched = true;
					}
				}
				// check if the value for that key is string
				if (typeof value == 'number') {
					if (value?.toString().includes(sanitizedSearchValue)) {
						isSearched = true;
					}
				}
			}
			if (isSearched) {
				return object;
			}
		});

		currentPage = 1;
	}

	// updates the content of the table each time the search value changes
	// NOTE: We also pass the tableData so that the rendered table gets updated when filters are applied
	$: updateTableDataRender(searchValue, tableData);

	// ---------------Sorting ------------------
	// the sortAccordingTo object is taken as a prop so as to preserve sorting when table data is null
	export let sortAccordingTo = {
		header: null,
		entityType: null,
		sortingOrder: null
	};

	function handleCreateSortAccordingToObject(header) {
		// determine sorting order
		// We have 3 states for ordering
		// Default is the API response order other two are ascending and descending
		// once the sorting order is clicked it is set to ascending and when clicked again it is set to descending
		let sortingOrder = '';

		// this block check if we are sorting the same element that we previously sorted
		if (sortAccordingTo.header === header) {
			// this block cycles through the sorting orders
			if (sortAccordingTo.sortingOrder === null) {
				sortingOrder = 'ascending';
			} else if (sortAccordingTo.sortingOrder === 'ascending') {
				sortingOrder = 'descending';
			} else if (sortAccordingTo.sortingOrder == 'descending') {
				sortingOrder = 'ascending';
			} else {
				sortingOrder = null;
			}
		} else {
			sortingOrder = 'ascending';
		}
		sortAccordingTo = {
			header: header,
			entityType: typeof tableData[0][header],
			sortingOrder: sortingOrder
		};
	}

	function handleSorting(sortAccordingTo) {
		// if sorting order is null revert back to the defaut order of element
		if (sortAccordingTo?.sortingOrder === null) {
			updateTableDataRender(searchValue);
		}

		if (sortAccordingTo?.entityType === 'string' && sortAccordingTo?.sortingOrder == 'ascending') {
			tableDataRender = tableDataRender?.sort((a, b) => {
				const entityA = a[sortAccordingTo?.header]?.toUpperCase(); // ignore upper and lowercase
				const entityB = b[sortAccordingTo?.header]?.toUpperCase(); // ignore upper and lowercase
				if (entityA < entityB) {
					return -1;
				}
				if (entityA > entityB) {
					return 1;
				}

				// names must be equal
				return 0;
			});
		} else if (
			sortAccordingTo?.entityType === 'string' &&
			sortAccordingTo?.sortingOrder == 'descending'
		) {
			tableDataRender = tableDataRender?.sort((a, b) => {
				const entityA = a[sortAccordingTo?.header]?.toUpperCase(); // ignore upper and lowercase
				const entityB = b[sortAccordingTo?.header]?.toUpperCase(); // ignore upper and lowercase
				if (entityA < entityB) {
					return 1;
				}
				if (entityA > entityB) {
					return -1;
				}

				// names must be equal
				return 0;
			});
		}

		if (sortAccordingTo?.entityType === 'number' && sortAccordingTo?.sortingOrder == 'ascending') {
			tableDataRender = tableDataRender?.sort(
				(a, b) => a[sortAccordingTo?.header] - b[sortAccordingTo?.header]
			);
		} else if (
			sortAccordingTo?.entityType === 'number' &&
			sortAccordingTo?.sortingOrder == 'descending'
		) {
			tableDataRender = tableDataRender?.sort(
				(a, b) => b[sortAccordingTo?.header] - a[sortAccordingTo?.header]
			);
		}
	}
	// NOTE: We also pass the tableData so that the rendered table gets resorted when filters are applied
	$: handleSorting(sortAccordingTo, tableData);

	// ------------------PAGINATION--------------------
	function calculateNumberOfPages(numberOfEntries, entriesPerPage) {
		// if the number of entries is divisible by the entries per page then the number of pages is the quotient
		if (numberOfEntries % entriesPerPage === 0) {
			const numberOfPages = numberOfEntries / entriesPerPage;
			return numberOfPages;
		}
		// if the number of entries is not divisible by the entries per page then the number of pages is the quotient + 1
		const numberOfPages = Math.floor(numberOfEntries / entriesPerPage);
		return numberOfPages + 1;
	}

	function getCurrentPageData(currentPage, entriesPerPage, numberOfEntries, tableDataRender) {
		const startingEntryIndex = currentPage * entriesPerPage - entriesPerPage;
		const endingEntryIndex = currentPage * entriesPerPage;

		if (endingEntryIndex > numberOfEntries) {
			return tableDataRender?.length ? tableDataRender?.slice(startingEntryIndex) : [];
		}

		return tableDataRender?.length
			? tableDataRender?.slice(startingEntryIndex, endingEntryIndex)
			: [];
	}

	function pageingationBarDisplayPages(currentPage, numberOfPages, sizeOfBar) {
		let change = numberOfPages - currentPage > sizeOfBar;
	}

	$: numberOfEntries = tableDataRender?.length;
	$: numberOfPages = calculateNumberOfPages(numberOfEntries, entriesPerPage);

	$: pageinationDisplayArray = updatepageinationDisplayArray(numberOfPages);

	function updatepageinationDisplayArray(numberOfPages) {
		let pageinationDisplayArray = [];
		for (let i = 0; i < numberOfPages; i++) {
			pageinationDisplayArray?.push({ displayText: `${'Page'} ${i + 1}`, index: i + 1 });
		}
		return pageinationDisplayArray;
	}

	let currentPage = 1;
	$: currentPageData = getCurrentPageData(
		currentPage,
		entriesPerPage,
		numberOfEntries,
		tableDataRender
	);
	$: startingEntryIndex = currentPage * entriesPerPage - entriesPerPage;
	$: endingEntryIndex = startingEntryIndex + currentPageData.length;

	function handlePageIncrement(numberOfPages) {
		if (currentPage < numberOfPages) {
			currentPage = currentPage + 1;
		}
	}

	function handlePageDecrement() {
		if (currentPage > 1) {
			currentPage = currentPage - 1;
		}
	}

	// This function parses the value of from the data using the key
	// This function allows to extract data from nested objects
	function parseDataFromKey(data, key) {
		if (typeof key === 'string') {
			return data[key];
		}
		if (typeof key === 'object') {
			const lenght = key?.length;
			let temp_data = data;
			for (let i = 0; i < lenght; i++) {
				temp_data = temp_data[key[i]];
			}

			return temp_data;
		}
		return '-';
	}
</script>

{#if currentPageData?.length>0}
<div class="flow-root border border-gray-50 rounded-lg shadow-sm">
	<div class=" overflow-x-auto">
		<div class="inline-block min-w-full align-middle">
			<div class="overflow-hidden ring-1 ring-black ring-opacity-5 rounded-lg">
				<table class="min-w-full divide-y divide-gray-300 table-fixed">
					<thead class={tableStyle == 'primary' ? 'bg-primary' : 'bg-gray-30'}>
						<tr>
							{#if tableHeadersDisplay}
								{#each tableHeadersDisplay as header}
									<th scope="col" style={header.width ? `width:${header.width};` : 'width:100%;'}>
										<button
											on:click={() => {
												handleCreateSortAccordingToObject(header?.key);
											}}
											class="px-4 text-left text-sm font-medium text-white w-full flex items-center capitalize"
											class:py-2={rowHeight === 'compact'}
											class:py-3={rowHeight === 'normal'}
											class:py-4={rowHeight === 'medium'}
										>
											<span>
												{header.name}
											</span>
											<!-- {#if sortAccordingTo?.header !== null} -->
											{#if typeof sortAccordingTo?.header === 'string' && sortAccordingTo?.header === header?.key}
												{#if sortAccordingTo?.sortingOrder === 'ascending'}
													<GoogleMatrialIcon iconName={'south'} addClass="text-base" />
													<!-- {:else}
												Hello -->
												{/if}
												{#if sortAccordingTo?.sortingOrder === 'descending'}
													<GoogleMatrialIcon iconName={'north'} addClass="text-base" />
													<!-- {:else}
												hello -->
												{/if}

												<!-- {/if} -->
											{/if}
										</button>
									</th>
								{/each}
							{/if}
							{#if actionConfigObject?.length > 0}
								<th
									scope="col"
									class="px-4 text-left text-sm font-medium text-darkGray relative"
									class:py-2={rowHeight === 'compact'}
									class:py-3={rowHeight === 'normal'}
									class:py-4={rowHeight === 'medium'}
								>
									<span class="sr-only">Action</span>
								</th>
							{/if}
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white leading-5">
						{#if currentPageData}
							{#each currentPageData as data}
								<tr>
									{#each tableHeadersDisplay as header, index}
										<td
											class="break-words whitespace-normal pl-4 pr-3 text-sm font-base text-darkGray"
											class:py-2={rowHeight === 'compact'}
											class:py-3={rowHeight === 'normal'}
											class:py-4={rowHeight === 'medium'}
										>
											{data[header?.key] || '-'}
										</td>
									{/each}
									{#if actionConfigObject?.length > 0}
										<td
											class="relative whitespace-nowrap px-4 text-sm font-medium"
											class:py-2={rowHeight === 'compact'}
											class:py-3={rowHeight === 'normal'}
											class:py-4={rowHeight === 'medium'}
										>
											<div class="flex gap-4 justify-center leading-3">
												{#each actionConfigObject as action}
													<!-- <button
													on:click={() => handleActionDispatch(action.actionName, data)}
													class="text-orange-100 hover:text-indigo-900"
												>
													<GoogleMatrialIcon iconName={action.actionIconName} />
													<span class="sr-only">{action.actionName}</span></button
												> -->
													<button
														on:click={() =>
															handleActionDispatch(action?.actionName, data, action?.modal)}
														class="text-orange-100 hover:text-indigo-900 relative"
														><div class="flex gap-0.5 items-start">
															{#if action?.goto}
																<a
																	href={action?.goto +
																		`?data=` +
																		encodeURIComponent(JSON.stringify(data))}
																	><GoogleMatrialIcon iconName={action?.actionIconName} /></a
																>
															{:else}
																<GoogleMatrialIcon iconName={action?.actionIconName} />
															{/if}
														</div>
														<span class="sr-only">{action?.actionName}</span></button
													>
												{/each}
											</div>
										</td>
									{/if}
								</tr>
							{/each}
						{/if}

						<!-- More people... -->
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
{#if showPagination}
	<div class="flex items-center justify-between mt-4 px-4 py-3 sm:px-6">
		<div class="flex flex-1 justify-between sm:hidden">
			<button
				on:click={() => handlePageDecrement()}
				class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
				>Previous</button
			>
			<button
				on:click={() => handlePageIncrement(numberOfPages)}
				class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
				>Next</button
			>
		</div>
		<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
			<div>
				<p class="text-sm text-gray-700">
					<span class="font-medium">{startingEntryIndex + 1}</span>
					-
					<span class="font-medium">{endingEntryIndex}</span>
					of
					<span class="font-medium">{numberOfEntries}</span>
					items
				</p>
			</div>
			<div>
				<nav class="isolate inline-flex -space-x-px rounded-md" aria-label="Pagination">
					<button
						on:click={() => handlePageDecrement()}
						class="relative inline-flex items-center rounded-l-md px-6 py-2 text-gray-400 hover:bg-gray-50 focus:z-20 min-w-24 justify-center gap-2"
					>
						<span class="sr-only">{'Previous'}</span>

						<svg
							class="h-5 w-5 fill-darkGray"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
								clip-rule="evenodd"
							/>
						</svg>
						<h1 class="text-sm flex items-center text-darkGray">{'Previous'}</h1>
					</button>
					<Select
						options={pageinationDisplayArray}
						display_func={(e) => e.displayText}
						value_func={(e) => e.index}
						bind:value={currentPage}
					/>

					<button
						on:click={() => handlePageIncrement(numberOfPages)}
						class="relative inline-flex items-center rounded-r-md px-6 py-2 text-gray-400 hover:bg-gray-50 focus:z-20 min-w-24 justify-center gap-2"
					>
						<span class="sr-only">{'Next'}</span>
						<h1 class="text-sm flex items-center text-darkGray">{'Next'}</h1>
						<svg
							class="h-5 w-5 fill-darkGray"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</nav>
			</div>
		</div>
	</div>
{/if}
{:else}
<ErrorMessage error={notFoundMessage}/>
{/if}