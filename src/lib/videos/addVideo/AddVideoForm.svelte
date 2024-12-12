<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { message } from '/src/routes/courses/courseStore.js';
	import { chapterList } from '$lib/data.js'
	import InputField from '$lib/components/InputField.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import TextDescriptionField from '$lib/components/TextDescriptionField.svelte';
	import ReviewForm from '$lib/components/ReviewForm.svelte';
	import SearchableComboBox from '$lib/components/SearchableComboBox.svelte';
	import SubmissionErrorMessage from '$lib/components/SubmissionErrorMessage.svelte';
	import DropDown from '$lib/components/DropDown.svelte';


	export let route;
	export let params;
	export let formObject = {
		courseCode: '',
		title: '',
		topic: '',
		chapter: '',
		uuid: '',
		videoURL:'',
		method: '',
		description:''
	};
	
	
	let saved = false;
	let validationErrors = {};
	let creationError = false;
	let method = 'post';
    

	onMount(() => {
		if (route.includes('edit')) {
			method = 'PUT';
		} else {
			method = 'POST';
		}
	});

	function handleDropDown(e) {
		if (e.detail.type == 'chapterDropdown') {
			formObject.chapter = e.detail.selectedItemName;
		}
	}

	function handleEnhance({ formElement, formData, action, cancel, submitter }) {
		let { search } = action;
		validationErrors = {};
		saved = !saved;
		Object.keys(formObject)?.forEach((key) => {
			formData.set(key, formObject[key]);
		});

		formData.set('method', method);

		// Validation for dropdowns
		formData?.forEach((value, key) => {
			if (key === 'chapter') {
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
						goto(`/videos`, { invalidateAll: true });
						message.set('video added successfully!');
					}
					if (method === 'PUT') {
						goto(`/videos`, { invalidateAll: true });
						message.set('video edited successfully!');
					}
				} else {
					// repopulating the dropdown placeholder
					formObject.courseCode = result?.data?.data?.courseCode;
					creationError = true;
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

<div class="m-4 lg:m-12 text-primary">
	{#if creationError}
		<div class="mb-2">
			<SubmissionErrorMessage errorMessage={'Failed to submit form data. Please try again!'} />
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
			<span class="text-xs lg:text-sm">Video Details</span>
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
	<form method="post" action="/courses" use:enhance={handleEnhance}>
		{#if !saved}
			<div>
				<h2 class="mb-4 font-semibold">1.{method==='POST'?'Add':'Edit'} Video Details</h2>
				<!-- First Row -->
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-20 mb-2 lg:mb-4">

					<InputField
					label={'course code'}
					placeholder={'Enter course code'}
					name={'courseCode'}
					type="text"
					bind:value={formObject.courseCode}
					readonly
				/>

					<InputField
					label={'topic'}
					placeholder={'Enter Topic'}
					name={'topic'}
					type="text"
					bind:value={formObject.topic}
					required
				/>
	
				</div>
			</div>

			<!-- Second Row -->
			<div class="grid grid-cols-1 lg:grid-cols-2 items-end mb-4 gap-2 lg:gap-20">
				<DropDown
				on:handleDispatchFilterData={handleDropDown}
				bind:selectedItemName={formObject.chapter}
				validationErrors={validationErrors ? validationErrors?.chapter : ''}
				options={chapterList}
				type={'chapterDropdown'}
				title={'chapter'}
			/>
			<InputField
			label={'Video URL'}
			placeholder={'Enter video URL'}
			name={'video URL'}
			type="text"
			bind:value={formObject.videoURL}
			required
		/>
			</div>
			
		{:else}
			<div class="mb-2 lg:mb-4 w-full">
				<ReviewForm>
	<div class="flex flex-col gap-3">

						<div>
							<div class="text-base font-semibold">{formObject?.title}</div>
							<div class="text-sm">Course Code:{formObject?.courseCode}</div>
						</div>
						
						<div>Topic:{formObject?.topic}</div>
						<div>Chapter:{formObject?.chapter}</div>
				   <div>Video URL:{formObject?.videoURL}</div>

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
				formaction={saved ? '?/final' : '?/review'}>{saved ? 'Submit' : 'Save&Next'}</button
			>
		</div>
	</form>
</div>
