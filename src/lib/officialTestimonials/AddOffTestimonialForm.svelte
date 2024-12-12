<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { message } from '/src/routes/officialTestimonials/store.js';
	import InputField from '$lib/components/InputField.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import TextDescriptionField from '$lib/components/TextDescriptionField.svelte';
	import SubmissionErrorMessage from '$lib/components/SubmissionErrorMessage.svelte';
	import ReviewForm from '$lib/components/ReviewForm.svelte';

	export let route;
	export let params;
	export let formObject = {
		nameEn: '',
		designationEn: '',
		testimonialTextEn: '',
		nameHi: '',
		designationHi: '',
		testimonialTextHi: '',
		uuid: '',
		image:null,
		method: ''
	};

	let saved = false;
	let validationErrors = {};
	let creationError = false;
	let method = 'post';
	let displayImage = null;
	let sizeErrorMessage = '';
	let imageUploadInputRef;
	const maxFileSizeInIntegers = 1;
	const maxFileSize = 0.5 * 1024 * 1024;
	let errorMessage = '';
	let isSubmitting=false
	let imageUrl=''

	onMount(() => {
		if (route.includes('edit')) {
			method = 'PUT';
			if (typeof formObject?.image == 'string') {
				imageUrl= formObject?.image;
			}
		} else {
			method = 'POST';
		}
	});

	$:if (method === 'PUT') {
			if (typeof formObject?.image == 'string') {
				displayImage = formObject?.image;
				formObject = formObject;
			}}


	// Enhance function
	function handleEnhance({ formElement, formData, action, cancel, submitter }) {
		let { search } = action;
		validationErrors = {};

		// This is done becuase enhance function is being triggered when the pdf is opened in another window
		if (search == '?/review') {
			saved = !saved;
		}

		if (search == '?/final') {
			isSubmitting=true;
		}

		Object.keys(formObject)?.forEach((key) => {
			formData.set(key, formObject[key]);
		});

		if (typeof imageUrl == 'string' && method ==='PUT') {
			formData.set('imageUrl', imageUrl);	
			}

		formData.set('method', method);

		// Validation for dropdowns
		// formData?.forEach((value, key) => {
		// 	if (key === 'categoryName') {
		// 		if (value?.length === 0) {
		// 			validationErrors[key] = `The field ${key} should not be empty.`;
		// 		}
		// 	}
		// });

		// If there are validation errors, cancel the submission and handle errors
		if (Object.keys(validationErrors)?.length > 0) {
			saved = false;
			cancel()
			return;
		}

		return async ({ result, update }) => {
			await result;
			isSubmitting=false

			// `result` is an `ActionResult` object
			if (search == '?/final') {
				if (!Object.keys(result?.data)?.includes('error')) {
					if (method === 'POST') {
						goto(`/officialTestimonials`, { invalidateAll: true });
						message.set(`Successfully added testimonial of '${formObject?.nameEn}'.`);
					}
					if (method === 'PUT') {
						goto(`/officialTestimonials`, { invalidateAll: true });
						message.set(`Successfully edited testimonial of '${formObject?.nameEn}'.`);
					}
					isSubmitting=false
				} else {
					formObject = formObject;
					creationError = true;
					if (result?.data?.error) {
						errorMessage = result?.data?.error;
					}
				}
			}
		};
	}

	function handelUploadImage() {
		imageUploadInputRef.click();
	}

	function sizeCheckForFiles(file) {
		if (file.size > maxFileSize) {
			sizeErrorMessage = `File size exceeds the ${maxFileSizeInIntegers} MB limit. The file is ${(file.size / 1024 / 1024).toFixed(2)} MB.`;
			return true;
		}
	}

	async function handleImageChange(event) {
		sizeErrorMessage = '';
		const imageFile = event.target?.files[0];
		// Reset input to allow selecting the same file again
		event.target.value = null;
		if (!imageFile) return;
		const sizeCheck = sizeCheckForFiles(imageFile);
		if (sizeCheck) return;
		formObject.image = imageFile;
		displayImage = URL.createObjectURL(imageFile);
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
			<span class="text-xs lg:text-sm">Official Testimonial Details</span>
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
		action="/officialTestimonials"
		enctype="multipart/form-data"
		use:enhance={handleEnhance}
	>
		{#if !saved}
			<div>
				<h2 class="mb-4 font-semibold">
					1.{method === 'POST' ? 'Add' : 'Edit'} Testimonial Details
				</h2>
				<hr class="my-4 border-t border-darkGray" />
				<!-- First Row -->
				<div class="grid grid-cols-1 place-items-start mb-4 gap-2 lg:gap-20">
					<!-- <div class="grid grid-cols-1 items-end mb-4 gap-2 order-2 lg:order-none"></div>
					<div class="grid grid-cols-1 items-end mt-2 mb-4 gap-2 order-1 lg:order-none"></div> -->
					<div class=" flex flex-col items-center gap-2">
						<img
							class="w-32 h-32 rounded-lg border object-cover"
							src={
								displayImage
									? displayImage.startsWith('blob:')
										? displayImage // Blob URL doesn't need a timestamp
										: `${displayImage}?t=${Date.now()}` // Append timestamp for external URLs
									: '/image-preview-icon.jpg'
							}
							alt="uploaded user profile"
						/>

						<button
							type="button"
							on:click={handelUploadImage}
							class="flex items-center gap-2 px-4 py-2 border border-gray-90 rounded-lg text-darkGray w-fit text-sm"
							><span class="material-icons-outlined text-center">upload_file</span>Display picture</button
						>
						<input
							type="file"
							name={'image'}
							bind:this={imageUploadInputRef}
							on:change={handleImageChange}
							class="hidden"
						/>
						{#if sizeErrorMessage}
							<p class=" text-xs text-center text-red-500">{sizeErrorMessage}</p>
						{/if}
					</div>
				</div>

				<hr class="my-4 border-t border-darkGray" />
				<h3 class=" font-semibold">Language wise testimonial details</h3>
				<h4 class=" text-xs mb-4 text-gray-400">
					Language wise details are necessary for multi-lingual support
				</h4>
				<div class="flex items-center space-x-2 mb-4">
					<div class="flex">
						<h3 class="font-semibold">English</h3>
						<span class="text-red-500">*</span>
					</div>
					<span class="text-xs text-gray-400">(Fill the details in English)</span>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-2 items-end mb-4 gap-2 lg:gap-20">
					<div class="grid gap-4">
						<InputField
							label={'Name'}
							placeholder={'Enter name'}
							name={'nameEn'}
							bind:value={formObject.nameEn}
							required
						/>
						<InputField
							label={'Designation'}
							placeholder={'Enter Designation'}
							name={'designationEn'}
							bind:value={formObject.designationEn}
							required
						/>
					</div>
				</div>
				<div class="mb-4 lg:mb-4 w-full">
					<TextDescriptionField
						label={'Testimonial text'}
						placeholder={'Enter testimonial text'}
						name={'testimonialTextEn'}
						bind:value={formObject.testimonialTextEn}
						required
					/>
				</div>

				<hr class="my-4 border-t border-darkGray" />
				<div class="flex items-center space-x-2 mb-4">
					<h3 class="font-semibold">Hindi</h3>
					<span class="text-xs text-gray-400">(Fill the details in Hindi)</span>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-2 items-end mb-4 gap-2 lg:gap-20">
					<div class="grid gap-4">
						<InputField
							label={'Name'}
							placeholder={'Enter name'}
							name={'nameHi'}
							bind:value={formObject.nameHi}
						/>
						<InputField
							label={'Designation'}
							placeholder={'Enter designation'}
							name={'designationHi'}
							bind:value={formObject.designationHi}
						/>
					</div>
				</div>
				<div class="mb-4 lg:mb-4 w-full">
					<TextDescriptionField
						label={'Testimonial text'}
						placeholder={'Enter testimonial text'}
						name={'testimonialTextEn'}
						bind:value={formObject.testimonialTextHi}
					/>
				</div>
			</div>
		{:else}
			<div class="mb-2 lg:mb-4 w-full p-4">
				<ReviewForm>
					<h2 class="text-lg font-semibold mb-4">Testimonial Details</h2>
					<hr class="mb-6" />

					<div class="flex flex-col md:flex-row gap-6">
						<div class="w-fit md:w-1/3 lg:w-1/4 flex-shrink-0">
							<img
								class="w-full h-48 object-contain object-center rounded-lg shadow-sm"
								src={
									displayImage
										? displayImage.startsWith('blob:')
											? displayImage // Blob URL doesn't need a timestamp
											: `${displayImage}?t=${Date.now()}` // Append timestamp for external URLs
										: '/image-preview-icon.jpg'
								}
								alt="Display thumbnail"
							/>
						</div>
						<div class="flex-grow">
							<!-- <h3 class=" font-medium mb-4 mt-2">Language-wise testimonial Details</h3> -->

							<!-- English Details -->
							<div class="mb-2">
								<h4 class="text-base font-semibold mb-2">English</h4>
								<div class="space-y-1">
									<p class="font-medium">{formObject?.nameEn ?? '-'}</p>
									<p class="text-sm text-gray-600">{formObject?.designationEn ?? '-'}</p>
									<p class="text-sm text-gray-600">{formObject?.testimonialTextEn ?? '-'}</p>
								</div>
							</div>

							<hr class="space-y-4 border-t border-darkGray" />
							<!-- Hindi Details -->
							<div>
								<h4 class="text-base font-semibold mb-2 mt-2">Hindi</h4>
								<div class="space-y-1">
									<p class="font-medium">
										{formObject?.nameHi ? formObject?.nameHi : 'Title: -'}
									</p>
									<p class="text-sm text-gray-600">
										{formObject?.designationHi ? formObject?.designationHi : 'Designation: -'}
									</p>
									<p class="text-sm text-gray-600">
										{formObject?.testimonialTextHi
											? formObject?.testimonialTextHi
											: 'Testimonial Text: -'}
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
				disabled={isSubmitting}
				formaction={saved ? '?/final' : '?/review'}
				>{saved ? 'Submit' : 'Save&Next'}
			</button>
		</div>
	</form>
</div>
