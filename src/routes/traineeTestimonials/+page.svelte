<script>
	import { message } from '/src/routes/traineeTestimonials/testimonialStore.js';
	import { page } from '$app/stores';
	import ListingTable from '$lib/traineeTestimonials/listing/ListingTable.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import SuccessMessage from '$lib/components/SuccessMessage.svelte';
	import DeletionModalViaAPI from '$lib/components/DeletionModalViaAPI.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import RadioButton from '$lib/components/RadioButton.svelte';
	import InputField from '$lib/components/InputField.svelte';
	import { goto } from '$app/navigation';

	export let data;

	let { testimonials } = data;

	let error;
	let tableData = [];
	let viewModal = false;
	let searchValue = '';
	let selectedLanguage = 'en';
	let tableActionName = '';
	let testimonialUuid = '';
	let personName = '';
	let designation = '';
	let testimonialText = '';
	let place = '';

	let deleteTextInput = '';

	let deletionConfirmText = 'please delete this testimonial';
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

	$: createTableData(testimonials, selectedLanguage);
	function createTableData() {
		let testimonialsCopy = [];
		error = '';
		tableData = [];

		if (testimonials?.error || !testimonials || testimonials.length === 0) {
			error = 'No testimonials available';
			return;
		}

		testimonialsCopy = testimonials;
		testimonialsCopy?.forEach((testimonial) => {
			const translation = testimonial?.translations?.find(
				(t) => t?.languageCode?.toLowerCase().trim() === selectedLanguage?.toLowerCase().trim()
			);

			if (!translation) {
				return;
			}

			const testimonialData = {
				uuid: testimonial?.uuid,
				name: translation?.name,
				place: translation?.place,
				designation: translation?.designation,
				testimonialText: translation?.testimonialText
			};

			tableData.push(testimonialData);
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
		personName = e.detail.actionData.name;
		designation = e.detail.actionData.designation;
		place = e.detail.actionData.place;
		testimonialText = e.detail.actionData.testimonialText;
		testimonialUuid = e.detail.actionData.uuid;
	}

	function handleCancel() {
		deleteTextInput = '';
		viewModal = false;
	}

	function handleTestimonialDeletion(e) {
		deleteTextInput = '';
		message.set('');
		const filteredTestimonials = tableData?.filter((faq) => {
			return faq?.uuid !== e.detail;
		});
		message.set(`Successully deleted the testimonial of "${personName}".`);
		tableData = filteredTestimonials;
	}

	function handleLanguageSelectionFromRadioButton(e) {
		selectedLanguage = e.detail;
	}

	function handleGoToTestimonialAddition() {
		message.set('');
		goto('/traineeTestimonials/add');
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
		<h1 class="mb-2 font-semibold text-base text-primary">Trainee Testimonials</h1>
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
			on:click={handleGoToTestimonialAddition}
		>
			+ Testimonial
		</button>
	</div>
	<ListingTable {searchValue} {tableData} on:tableActionClick={handleTableAction} {error} />
</div>

<div>
	{#if viewModal && tableActionName === 'delete'}
		<DeletionModalViaAPI
			id={testimonialUuid}
			name={personName}
			heading={`About to delete the testimonial - ${personName}`}
			para={'Are you sure you want to delete this testimonial? This action cannot be undone.'}
			endPoint={'/apis/traineeTestimonials/'}
			{deleteTextConfirmation}
			on:handleCancelDeletion={handleCancel}
			on:handleDeletion={handleTestimonialDeletion}
		>
			<hr />
			<div class=" flex flex-col gap-2 p-6">
				<div>
					<p class="text-sm text-darkGray capitalize">Name : {personName}</p>
					<p class="text-sm text-darkGray">Designation : {designation}</p>
					<p class="text-sm text-darkGray">Place : {place}</p>
					<p class="text-sm text-darkGray">Testimonial text : {testimonialText}</p>
				</div>
			</div>
			<hr class="mb-2" />
			<div class="">
				<InputField
					label={"Type 'Please delete this testimonial' to confirm"}
					placeholder={" Type 'Please delete this testimonial'"}
					name={'deletion'}
					labelFontWeight={'font-normal'}
					bind:value={deleteTextInput}
					required
				/>
			</div>
		</DeletionModalViaAPI>
	{/if}
</div>
