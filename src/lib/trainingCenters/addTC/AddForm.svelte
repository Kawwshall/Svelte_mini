<script>
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import Address from '$lib/components/Address.svelte';
	import InputField from '$lib/components/InputField.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import DropDown from '$lib/components/DropDown.svelte';
	import SubmissionErrorMessage from '$lib/components/SubmissionErrorMessage.svelte';
	import ReviewForm from '$lib/components/ReviewForm.svelte';
	import { goto } from '$app/navigation';
	import TextDescriptionField from '$lib/components/TextDescriptionField.svelte';
	import { message } from '/src/routes/courses/courseStore.js';
	import { String_Constants } from '/src/config/constants.js';
	import SearchableComboBox from '$lib/components/SearchableComboBox.svelte';
	import Button from '$lib/components/Button.svelte';
	import { page } from '$app/stores';
	import { distList } from '$lib/data.js';

	let saved = false;
	let validationErrors = {};
	let creationError = '';
	let method = 'POST';
	let isSubmitting = false;
	let districtList = [];

	export let stateData = [];
	export let route;
	export let params;
	export let bankData = [];
	export let isEditMode = false;
	export let tcObject = {
		uuid: '',
		bankId: '',
		bankName: '',
		stateId: 0,
		extId: '',
		email: '',
		contactNo: '',
		directorContactNo: '',
		nameEnglish: '',
		addressEnglish: '',
		districtEnglish: '',
		directorNameEn: '',
		nameHindi: '',
		districtHindi: '',
		addressHindi: '',
		directorNameHi: '',
		stateName: '',
		method: '',
		translationIdEnglish: 0,
		translationIdHindi: 0
	};

	onMount(() => {
		if (route?.includes('edit')) {
			method = 'PUT';
		} else {
			method = 'POST';
		}
	});

	function handleGoBack() {
		window.history.back();
	}

	function handlePrevious() {
		saved = false;
		tcObject = tcObject;
	}

	function preparePayload(method) {
		const payload = {
			uuid: tcObject.uuid,
			bankId: tcObject.bankId,
			stateId: parseInt(tcObject.stateId),
			extId: tcObject.rsetiId,
			email: tcObject.email,
			contactNo: tcObject.contactNo,
			directorContactNo: tcObject.directorContactNo,
			translations: [
				{
					id: tcObject.translationIdEnglish ? tcObject.translationIdEnglish : '',
					languageCode: 'en',
					district: tcObject.districtEnglish,
					name: tcObject.nameEnglish,
					address: tcObject.addressEnglish,
					directorName: tcObject.directorNameEn
				},
				{
					id: tcObject.translationIdHindi ? tcObject.translationIdHindi : '',
					languageCode: 'hi',
					district: tcObject.districtHindi,
					name: tcObject.nameHindi,
					address: tcObject.addressHindi,
					directorName: tcObject.directorNameHi
				}
			]
		};

		if (method === 'PUT') {
			// Include `uuid` and `translations` ids only for PUT method
			payload.uuid = tcObject.uuid;
			// payload.translations[0].id = tcObject.translationIdEnglish;
			// payload.translations[1].id = tcObject.translationIdHindi;
		}

		return payload;
	}

	function validateForm() {
		validationErrors = {}; // Reset errors

		// Validate SearchableComboBox (Bank)
		if (!tcObject.bankId) {
			validationErrors.bankId = 'Please select a bank.';
		}

		// Validate DropDown (State)
		if (!tcObject.stateId) {
			validationErrors.stateId = 'Please select a state.';
		}

		return Object.keys(validationErrors).length === 0; // Returns true if no errors
	}

	function handleEnhance({ formElement, formData, action, cancel, submitter }) {
		let { search } = action;
		validationErrors = {};

		formData.set('method', method);
		if (method === 'PUT') {
			formData.set('uuid', tcObject.uuid);
		}

		// Prepare the payload to match backend expectations
		const payload = preparePayload();

		formData.set('data', JSON.stringify(payload));

		// TODO perform required validations

		if (Object.keys(validationErrors)?.length > 0) {
			saved = false;
			cancel();
			return;
		}
		if (!validateForm()) {
			cancel();
			return;
		}
		return async ({ result, update }) => {
			await result;
			if (search == '?/review' && result.type === 'success') {
				saved = true;
			}

			if (search == '?/final') {
				isSubmitting = true;
				if (!Object.keys(result?.data)?.includes('error')) {
					if (method === 'POST') {
						goto(`/trainingCenters`, { invalidateAll: true });
						message.set(`Successfully added training center "${tcObject.nameEnglish}"! `);
					}
					if (method === 'PUT') {
						goto(`/trainingCenters`, { invalidateAll: true });
						message.set(`Successfully edited training center "${tcObject.nameEnglish}"!`);
					}
				} else {
					const errorMsg =
						method === 'PUT'
							? 'Failed to update training center. Please try again!'
							: 'Failed to add training center. Please try again!';
					tcObject.category = result?.data?.data?.category;
					creationError = result?.data?.error ? result?.data?.error : errorMsg;
					isSubmitting = false;
				}
			}
		};
	}

	function handleDropDown(e) {
		if (e.detail.type === 'categoryDropdown') {
			// Find the selected bank from bankData by matching the selected item name

			const selectedBank = bankData.find(
				(bank) =>
					bank.name?.trim().toLowerCase() === e.detail.selectedItemName?.trim().toLowerCase()
			);

			if (selectedBank) {
				tcObject.bankId = selectedBank.uuid;
			}
		} else if (e.detail.type === 'stateDropDown') {
			const selectedState = stateData.find(
				(state) =>
					state.name?.trim().toLowerCase() == e.detail.selectedItemName?.trim().toLowerCase()
			);
			if (selectedState) {
				tcObject.stateId = selectedState.extId;
			}
		}
	}

	// let stateFilterOptionList = [
	// 	// { title: String_Constants.ALL_STATES, uuid: 0 },
	// 	...stateData
	// 		.filter((state) => state.languageCode === 'en' && state.name && state.extId) // Filter by languageCode and valid name/extId
	// 		.map((state) => ({
	// 			title: state.name.trim(),
	// 			uuid: state.extId
	// 		}))
	// ];

	let stateFilterOptionList = [];

	stateData.forEach((item) => {
		if (item.languageCode === 'en' && item.name && item.extId) {
			stateFilterOptionList.push({ title: item.name.trim(), uuid: item.extId });
		}
	});

	let bankDataList = [
		// { title: String_Constants.ALL_BANKS, uuid: 0 },
		...bankData
			.filter((bank) => bank.name && bank.uuid) // Filter by languageCode and valid name/extId
			.map((bank) => ({
				title: bank.name,
				uuid: bank.uuid
			}))
	];

	function handleDistrictSelection(event) {
		const selectedDistId = event.detail.selectedItemName;

		// tcObject.selectedDistrict = event.detail.selectedItemName;
		// tcObject.selectedDistrictId = event.detail.selectedItemId;
	}
	function handleDistrictClearFilter(event) {
		// tcObject.selectedDistrict = event.detail.selectedItemName;
		// tcObject.selectedDistrictId = event.detail.selectedItemId;
	}
	function handleBankId(event) {
		tcObject.bankName = event.detail.selectedItemName;
		tcObject.bankId = event.detail.selectedItemId;
	}

	function handleBankClearFilter() {
		tcObject.bankName = '';
		tcObject.bankId = '';
	}

	function handleStateId(event) {
		tcObject.stateName = event.detail.selectedItemName; // Or value based on your use case
		tcObject.stateId = event.detail.selectedItemId;

		//updating the district list
		districtList = [];
		stateData.forEach((item) => {
			if (item.extId == tcObject.stateId) {
				if (item.languageCode === 'en') {
					// districtList = [...districtList, ...item.districts];
				}
				if (item.languageCode === 'hi') {
					// districtList = [...districtList, ...item.districts];
				}
			}
		});
		districtList = distList;
		districtList = districtList.map((item, index) => {
			return { ...item, uuid: index + 1 };
		});
	}

	function handleStateClearFilter() {
		tcObject.stateName = '';
		tcObject.stateId = '';
		districtList = [];
	}
</script>

<div class="my-4 text-primary">
	{#if creationError}
		<div class="mb-2">
			<SubmissionErrorMessage errorMessage={creationError} />
		</div>
	{/if}

	<div class="flex justify-center items-center mb-6 lg:mb-4 text-sm font-noto">
		<div class="flex flex-col">
			<span
				class="flex justify-center border-2 px-2 py-0.5 lg:px-2 lg:py-1 rounded-full text-xs lg:text-sm self-center h-6 w-6 lg:h-8 lg:w-8"
				class:font-semibold={!saved}>1</span
			>
			<span class="text-xs lg:text-sm">Training center Details</span>
		</div>

		<div class=" w-20 border-t lg:border-t-2 border-darkGray border-dashed self-center">&nbsp;</div>

		<div class="flex flex-col">
			<span
				class="flex justify-center border-2 lg:py-1 lg:px-2 rounded-full self-center h-6 w-6 lg:h-8 lg:w-8"
				class:bg-green-900={saved}
				class:text-white={saved}>✓</span
			>
			<span class="text-xs lg:text-sm">Completed</span>
		</div>
	</div>
	<form method="post" action="?/review" use:enhance={handleEnhance} class="form">
		<div>
			{#if !saved}
				<h2 class=" heading-L">
					1.{method === 'POST' ? 'Add' : 'Edit'} Training Center Details
				</h2>
				<hr class="mt-2 mb-8 horizontal line" />
				<h3 class="my-4 heading-L">Basic Details</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-4 mb-2 md:mb-8">
					<InputField
						label={'RESTI Id'}
						type="text"
						placeholder={'Enter RESTI Id'}
						name={'rsetiId'}
						bind:value={tcObject.rsetiId}
						required
						disabled={isEditMode}
					/>
					<div>
						<SearchableComboBox
							options={bankDataList}
							label={'Select bank'}
							filterCategory={'courseListing'}
							placeholder={'Select sponsor bank'}
							bind:selectedItemName={tcObject.bankName}
							on:handleDispatchComboBoxData={handleBankId}
							on:handleDispatchFilterData={handleBankClearFilter}
						/>
						{#if validationErrors.bankId}
							<p class="text-red-600 text-xs mt-1">{validationErrors.bankId}</p>
						{/if}
					</div>

					<InputField
						label={'Phone Number'}
						type="number"
						name="phoneNumber"
						placeholder={'Enter Phone Number'}
						bind:value={tcObject.contactNo}
						required
					/>

					<InputField
						label={'Email'}
						placeholder={'Enter Email'}
						type="email"
						name={'email'}
						bind:value={tcObject.email}
						required
					/>
					<div>
						<SearchableComboBox
							options={stateFilterOptionList}
							label={'Select state'}
							filterCategory={'stateListing'}
							placeholder={'Select state of Training Center'}
							bind:selectedItemName={tcObject.stateName}
							on:handleDispatchComboBoxData={handleStateId}
							on:handleDispatchFilterData={handleStateClearFilter}
						/>
						{#if validationErrors.stateId}
							<p class="text-red-600 text-xs mt-1">{validationErrors.stateId}</p>
						{/if}
					</div>
					<InputField
						label={"Director's phone no."}
						placeholder={"Enter Director's phone no."}
						type="number"
						name={'directorsPhone'}
						bind:value={tcObject.directorContactNo}
					/>
					<div>
						{#if districtList?.length > 0}
							<SearchableComboBox
								options={districtList}
								label={'Select district'}
								filterCategory={'districtList'}
								placeholder={'Select district'}
								bind:selectedItemName={tcObject.selectedDistrict}
								on:handleDispatchComboBoxData={handleDistrictSelection}
								on:handleDispatchFilterData={handleDistrictClearFilter}
							/>
							{#if validationErrors.bankId}
								<p class="text-red-600 text-xs mt-1">{validationErrors.bankId}</p>
							{/if}
						{/if}
					</div>
				</div>
				<hr class="my-8 horizontal-line" />
				<h3 class=" heading-L">Language wise Training Center details</h3>
				<h4 class=" helper-text mb-4">
					Language wise details are neccessary for multi-lingual support
				</h4>
				<div class="flex items-center space-x-2 mb-4">
					<div class="flex">
						<h3 class="font-medium">English</h3>
						<span class="text-red-500">*</span>
					</div>
					<span class="text-xs text-gray-90">( Fill the details in English )</span>
				</div>
				<div class="grid grid-cols-2 gap-4 mb-2 lg:mb-4">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-4 mb-2 col-span-2">
						<InputField
							label={'Name of Training center'}
							type="text"
							placeholder={'Enter Training center name'}
							name={'englishName'}
							required
							bind:value={tcObject.nameEnglish}
						/>
						<InputField
							label={"Director's name"}
							type="text"
							placeholder={"Enter Training center Director's name"}
							name={'directorNameEn'}
							required
							bind:value={tcObject.directorNameEn}
						/>
					</div>
					<div class="col-span-2">
						<TextDescriptionField
							label={'Address'}
							placeholder={'Enter Address'}
							name={'descriptionEn'}
							bind:value={tcObject.addressEnglish}
							required
						/>
					</div>
				</div>

				<hr class="my-8 horizontal-line" />

				<div class="flex items-center space-x-2 mb-4">
					<h3 class="font-medium">Hindi</h3>
					<span class="text-xs text-gray-90">( Fill the details in Hindi )</span>
				</div>
				<div class="grid grid-cols-2 gap-4 mb-2 lg:mb-4">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-4 mb-2 col-span-2">
						<InputField
							label={'Name of Training center'}
							placeholder={'Enter Training center name'}
							name={'hindiName'}
							bind:value={tcObject.nameHindi}
						/>
						<InputField
							label={"Director's name"}
							type="text"
							placeholder={"Enter Training center Director's name"}
							name={'directorNameHi'}
							bind:value={tcObject.directorNameHi}
						/>
					</div>
					<div class="col-span-2">
						<TextDescriptionField
							label={'Address'}
							placeholder={'Enter Address'}
							name={'descriptionEn'}
							bind:value={tcObject.addressHindi}
						/>
					</div>
				</div>
			{:else}
				<div class="mb-2 lg:mb-4 w-full">
					<ReviewForm>
						<h2 class="heading-L">Training Center Details</h2>
						<hr class="mb-4 mt-2 horizontal-line" />
						<div class="flex flex-col text-darkGray">
							<!-- Section 1: Institution Details -->
							<div class="flex flex-col gap-2 text-sm">
								<div class="text-sm">
									<span class="label">ID : </span>
									{tcObject?.rsetiId}
								</div>
								<div class="text-sm">
									<span class="label">Bank : </span>{tcObject?.bankName}
								</div>
								<div class="text-sm">
									<span class="label">Phone no: </span>{tcObject?.contactNo}
								</div>
								<div class="text-sm">
									<span class="label">Email : </span>{tcObject?.email}
								</div>
								<div class="text-sm">
									<span class="label">State/UT : </span>{tcObject?.stateName}
								</div>
							</div>
							<hr class="my-8 horizontal-line" />

							<div class="flex flex-col gap-2 text-sm">
								<h3 class=" heading-L">Language-wise Training center Details</h3>
								<h4 class="heading-L mb-2">English</h4>

								<div class="font-medium text-base">{tcObject?.nameEnglish}</div>
								<div class=""><span class="label">Address : </span>{tcObject?.addressEnglish}</div>

								<hr class="my-4 horizontal-line" />
								<h4 class="heading-L mb-2">Hindi</h4>

								<div class="font-medium text-base {!tcObject?.nameHindi ? 'text-red-600' : ''}">
									{tcObject?.nameHindi ? tcObject?.nameHindi : 'No Hindi title added'}
								</div>

								<div class="">
									<span class="label {!tcObject.addressHindi ? 'text-red-600' : ''}"
										>Address :
									</span>{tcObject?.addressHindi ? tcObject?.addressHindi : '-'}
								</div>
							</div>
						</div>
					</ReviewForm>
				</div>
			{/if}
		</div>
		<div class="flex justify-end gap-4 flex-wrap my-4">
			<Button
				type="button"
				btnType="secondary"
				customClass={'inline-block w-full bp-420px:w-fit flex justify-center'}
				on:click={saved ? handlePrevious : handleGoBack}>{saved ? 'Edit' : 'Cancel'}</Button
			>
			<Button
				btnType="primary"
				type="submit"
				customClass={'inline-block w-full bp-420px:w-fit flex justify-center'}
				disabled={isSubmitting}
				formaction={saved ? '?/final' : '?/review'}>{saved ? 'Submit' : 'Save & Next'}</Button
			>
		</div>
	</form>
</div>
