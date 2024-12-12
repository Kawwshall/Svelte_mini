<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { courseCategory, faqCategory } from '$lib/data.js';
	import { onMount } from 'svelte';
	import { message } from '/src/routes/courses/courseStore.js';
	import DropDown from '$lib/components/DropDown.svelte';
	import InputField from '$lib/components/InputField.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import TextDescriptionField from '$lib/components/TextDescriptionField.svelte';
	import SubmissionErrorMessage from '$lib/components/SubmissionErrorMessage.svelte';
	import ReviewForm from '$lib/components/ReviewForm.svelte';

	export let route;
	export let params;
	export let formObject = {
		categoryId: '',

		questionEn: '',
		questionHi: '',
		categoryName: '',
		answerEn: '',
		answerHi: '',
		uuid: '',
		method: ''
	};

	let saved = false;
	let validationErrors = {};
	let creationError = false;
	let method = 'post';
	let displayImage = null;
	let errorMessage = '';
	onMount(() => {
		if (route.includes('edit')) {
			method = 'PUT';
		} else {
			method = 'POST';
		}
	});

	function handleDropDown(e) {
		if (e.detail.type == 'categoryDropdown') {
			formObject.categoryId = e.detail.selectedItemId;
		}
	}

	// Enhance function

	function handleEnhance({ formElement, formData, action, cancel, submitter }) {
		let { search } = action;
		validationErrors = {};

		// This is done becuase enhance function is being triggered when the pdf is opened in another window
		if (search == '?/review') {
			saved = !saved;
		}

		Object.keys(formObject)?.forEach((key) => {
			formData.set(key, formObject[key]);
		});

		formData.set('method', method);

		// Validation for dropdowns
		formData?.forEach((value, key) => {
			if (key === 'categoryName') {
				if (value?.length === 0) {
					validationErrors[key] = `The field ${key} should not be empty.`;
				}
			}
		});

		// If there are validation errors, cancel the submission and handle errors
		if (Object.keys(validationErrors)?.length > 0) {
			saved = false;
			cancel();
			return;
		}

		return async ({ result, update }) => {
			await result;
			// `result` is an `ActionResult` object
			if (search == '?/final') {
				if (!Object.keys(result?.data)?.includes('error')) {
					if (method === 'POST') {
						goto(`/FAQs`, { invalidateAll: true });
						message.set('FAQ added successfully!');
					}
					if (method === 'PUT') {
						goto(`/FAQs`, { invalidateAll: true });
						message.set('FAQ edited successfully!');
					}
				} else {
					// repopulating the dropdown placeholder
					formObject.categoryId = result?.data?.data?.categoryId;
					formObject = formObject;
					creationError = true;
					if (result?.data?.error) {
						errorMessage = result?.data?.error;
					}
				}
			}
		};
	}

	function handleGoBack() {
		window.history.back();
	}

	function handlePrevious() {
		saved = false;
		formObject = formObject;
	}
</script>

<div class="m-4 lg:m-12 text-darkGray">
	{#if creationError}
		<div class="mb-2">
			<SubmissionErrorMessage {errorMessage} />
		</div>
	{/if}
	<div class="mb-6 lg:mb-0">
		<BreadCrumbs {route} {params} />
	</div>

	<div class="flex justify-center items-center mb-6 lg:mb-4 text-sm font-noto">
		<div class="flex flex-col">
			<span
				class="flex justify-center border-2 px-2 py-0.5 lg:px-2 lg:py-1 rounded-full text-xs lg:text-sm self-center h-6 w-6 lg:h-8 lg:w-8"
				class:font-semibold={!saved}>1</span
			>
			<span class="text-xs lg:text-sm">FAQ Details</span>
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
	<form
		method="post"
		action="/faqs"
		enctype="multipart/form-data"
		use:enhance={handleEnhance}
		class="form"
	>
		{#if !saved}
			<div>
				<h2 class="mb-4 font-semibold">1.{method === 'POST' ? 'Add' : 'Edit'} FAQ Details</h2>
				<hr class="my-4 border-t border-darkGray" />
				<!-- First Row -->
				<div class="grid grid-cols-1 lg:grid-cols-2 items-end mb-4 gap-2 lg:gap-20">
					<div class="grid grid-cols-1 items-end mb-4 gap-2 order-2 lg:order-none">
						<DropDown
							on:handleDispatchFilterData={handleDropDown}
							bind:selectedItemId={formObject.categoryId}
							bind:selectedItemName={formObject.categoryName}
							validationErrors={validationErrors ? validationErrors?.categoryId : ''}
							options={faqCategory}
							type={'categoryDropdown'}
							title={'FAQ category'}
						/>
					</div>
					<div class="grid grid-cols-1 items-end mt-2 mb-4 gap-2 order-1 lg:order-none"></div>
				</div>

				<hr class="my-4 border-t border-darkGray" />
				<h3 class=" font-semibold">Language wise FAQ details</h3>
				<h4 class=" text-xs mb-4 text-gray-400">
					Language wise details are necessary for multi-lingual support
				</h4>
				<div class="flex items-center space-x-2 mb-4">
					<div class="flex">
						<h3 class="font-semibold">English</h3>
						<span class="text-red-500">*</span>
					</div>
					<span class="text-xs text-gray-400">(Fill the details in english)</span>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-2 items-end mb-4 gap-2 lg:gap-20">
					<InputField
						label={'Question'}
						placeholder={'Enter question'}
						name={'questionEn'}
						bind:value={formObject.questionEn}
						required
					/>
				</div>
				<div class="mb-4 lg:mb-4 w-full">
					<TextDescriptionField
						label={'Answer'}
						placeholder={'Enter descriptive answer'}
						name={'answerEn'}
						bind:value={formObject.answerEn}
						required
					/>
				</div>

				<hr class="my-4 border-t border-darkGray" />
				<div class="flex items-center space-x-2 mb-4">
					<h3 class="font-semibold">Hindi</h3>
					<span class="text-xs text-gray-400">(Fill the details in hindi)</span>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-2 items-end mb-4 gap-2 lg:gap-20">
					<InputField
						label={'Question'}
						placeholder={'Enter question'}
						name={'questionHi'}
						bind:value={formObject.questionHi}
					/>
				</div>
				<div class="mb-4 lg:mb-4 w-full">
					<TextDescriptionField
						label={'Answer'}
						placeholder={'Enter descriptive answer'}
						name={'answerHi'}
						bind:value={formObject.answerHi}
					/>
				</div>
			</div>
		{:else}
			<div class="mb-2 lg:mb-4 w-full p-4">
				<ReviewForm>
					<h2 class="text-lg font-semibold mb-4">FAQ Details</h2>
					<hr class="mb-6" />

					<div class="flex flex-col md:flex-row gap-6">
						<div class="flex-grow">
							<div class="grid grid-cols-1 sm:grid-cols-1 gap-1 mb-2">
								<p class=" capitalize">FAQ Category: {formObject?.categoryName ?? '-'}</p>
							</div>
							<hr class="space-y-4 border-t border-darkGray" />
							<h3 class=" font-medium mb-4 mt-2">Language-wise FAQ Details</h3>

							<!-- English Details -->
							<div class="mb-2">
								<h4 class="text-base font-semibold mb-2">English</h4>
								<div class="space-y-1">
									<p class="font-medium">{formObject?.questionEn ?? '-'}</p>
									<p class="text-sm text-gray-600">{formObject?.answerEn ?? '-'}</p>
								</div>
							</div>

							<hr class="space-y-4 border-t border-darkGray" />
							<!-- Hindi Details -->
							<div>
								<h4 class="text-base font-semibold mb-2 mt-2">Hindi</h4>
								<div class="space-y-1">
									<p class="font-medium">
										{formObject?.questionHi ? formObject?.questionHi : 'Question: -'}
									</p>
									<p class="text-sm text-gray-600">
										{formObject?.answerHi ? formObject?.answerHi : 'Answer: -'}
									</p>
								</div>
							</div>
						</div>
					</div>
				</ReviewForm>
			</div>
		{/if}

		<div class="flex justify-end gap-4">
			{#if saved}
				<button
					type="button"
					class="rounded-md bg-white px-4 py-2 text-sm font-semibold text-darkgray border-2 shadow-sm"
					on:click={handlePrevious}>Previous</button
				>
			{:else}
				<button
					type="button"
					class="rounded-md bg-white px-4 py-2 text-sm font-semibold text-darkgray border-2 shadow-sm"
					on:click={handleGoBack}>Cancel</button
				>
			{/if}
			<button
				class="rounded-md bg-darkGray px-4 py-2 text-sm font-semibold text-white shadow-sm"
				type="submit"
				formaction={saved ? '?/final' : '?/review'}
				>{saved ? 'Submit' : 'Save&Next'}
			</button>
		</div>
	</form>
</div>
