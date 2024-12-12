<script>
	import { goto } from '$app/navigation';
	import { String_Constants } from '/src/config/constants.js';
	import { message } from '/src/routes/FAQs/faqStore.js';
	import { page } from '$app/stores';
	import { getFAQCategoryName } from '$lib/utils/helper.js';
	import ListingTable from '$lib/faqs/listing/ListingTable.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import SuccessMessage from '$lib/components/SuccessMessage.svelte';
	import DeletionModalViaAPI from '$lib/components/DeletionModalViaAPI.svelte';
	import RadioButton from '$lib/components/RadioButton.svelte';
	import InputField from '$lib/components/InputField.svelte';

	export let data;

	let { FAQData } = data;

	let error;
	let tableData = [];
	let viewModal = false;
	let searchValue = '';
	let selectedLanguage = 'en';
	let tableActionName = '';
	let faqUuid = '';
	let question = '';
	let answer = '';
	let description = '';
	let duration = null;
	let videosCount = null;
	let deleteTextInput = '';
	let chaptersCount = null;
	let deletionConfirmText = 'please delete this faq';
	let deleteTextConfirmation = false;

	// Function to normalize text (removes spaces and ignores case)
	const normalizeText = (text) => text?.trim().toLowerCase().replace(/\s+/g, ' ');

	function sendSearchValueToDatatable(e) {
		searchValue = e.detail;
	}
	// Function to check if input matches the required text
	$: isTextValid(deleteTextInput);
	function isTextValid() {
		deleteTextConfirmation = normalizeText(deleteTextInput) === normalizeText(deletionConfirmText);
	}

	$: createTableData(FAQData, selectedLanguage);
	function createTableData() {
		let FAQsCopy = [];
		error = '';
		tableData = [];

		if (FAQData?.error || !FAQData || FAQData.length === 0) {
			error = 'No FAQs available';
			return;
		}

		FAQsCopy = FAQData;
		FAQsCopy?.forEach((FAQ) => {
			let categoryName = '';

			const translation = FAQ?.translations?.find(
				(t) => t?.languageCode?.toLowerCase().trim() === selectedLanguage?.toLowerCase().trim()
			);

			if (!translation) {
				return;
			}

			if (FAQ?.categoryId) {
				categoryName = getFAQCategoryName(FAQ?.categoryId);
			}

			let FAQObj = {
				uuid: FAQ?.uuid,
				answer: translation?.answer,
				question: translation?.question,
				categoryId: FAQ?.categoryId,
				categoryName: categoryName
			};

			tableData.push(FAQObj);
			tableData = tableData;
		});

		return tableData;
	}

	function handleSuccesMessageClose(e) {
		message.set('');
	}

	function handleTableAction(e) {
		message.set('');
		viewModal = e.detail.viewModal;
		tableActionName = e.detail.actionName;
		question = e.detail.actionData.question;
		answer = e.detail.actionData.answer;
		faqUuid = e.detail.actionData.uuid;
	}

	function handleCancel() {
		deleteTextInput = '';
		viewModal = false;
	}

	function handleFAQDeletion(e) {
		deleteTextInput = '';
		message.set('');
		let filteredFaqs = tableData?.filter((faq) => {
			return faq?.uuid !== e.detail;
		});
		message.set(`Successully deleted the FAQ - ${question}.`);
		tableData = filteredFaqs;
	}

	function handleLanguageSelectionFromRadioButton(e) {
		selectedLanguage = e.detail;
	}
</script>

{#if $message}
	<SuccessMessage
		successMessage={$message}
		on:handleSuccessMessageClose={handleSuccesMessageClose}
	/>
{/if}

<div class="flex justify-between items-start mb-8 gap-4 flex-nowrap">
	<div>
		<h1 class="mb-2 font-semibold text-primary text-base">Frequently Asked Questions</h1>
		<div class="">
			<RadioButton
				languageOptionOne={'english'}
				languageCodeOne={'en'}
				languageOptionTwo={'hindi'}
				languageCodeTwo={'hi'}
				on:handleLanguageFromRadioButton={handleLanguageSelectionFromRadioButton}
			/>
		</div>
	</div>
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
		>
			<a href="/FAQs/add"> + New FAQ </a>
		</button>
	</div>
	<ListingTable {searchValue} {tableData} on:tableActionClick={handleTableAction} {error} />
</div>

<div>
	{#if viewModal && tableActionName === 'delete'}
		<DeletionModalViaAPI
			id={faqUuid}
			name={question}
			heading={`About to delete the FAQ - ${question}`}
			para={'Are you sure you want to delete this question? This action cannot be undone.'}
			endPoint={'/apis/faqs/'}
			{deleteTextConfirmation}
			on:handleCancelDeletion={handleCancel}
			on:handleDeletion={handleFAQDeletion}
		>
			<hr />
			<div class=" flex flex-col gap-2 p-6">
				<div>
					<p class="text-sm text-darkGray capitalize">Question : {question}</p>
					<p class="text-sm text-darkGray">Answer : {answer}</p>
				</div>
			</div>
			<hr class="mb-2" />
			<div class="">
				<InputField
					label={"Type 'Please delete this FAQ' to confirm"}
					placeholder={" Type 'Please delete this FAQ'"}
					name={'deletion'}
					labelFontWeight={'font-normal'}
					bind:value={deleteTextInput}
					required
				/>
			</div>
		</DeletionModalViaAPI>
	{/if}
</div>
