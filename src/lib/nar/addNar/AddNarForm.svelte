<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { message } from '/src/routes/nar/narStore.js';
	import InputField from '$lib/components/InputField.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import SubmissionErrorMessage from '$lib/components/SubmissionErrorMessage.svelte';
	import Address from '$lib/components/Address.svelte';
	import ReviewForm from '$lib/components/ReviewForm.svelte';
	import TextDescriptionField from '$lib/components/TextDescriptionField.svelte';


	export let route;
	export let params;
	export let stateData;
	export let formObject = {
		email1: '',
		email2: '',
		phoneno1: '',
		phoneno2: '',
		address:'',
		languageCode: 'en',
		uuid: '',
		method: ''
	};

	let saved = false;
	let validationErrors = {};
	let creationError = false;
	let method = 'post';

	$: phoneno = `${formObject?.phoneno1},${formObject?.phoneno2}`;
	$: email = `${formObject?.email1},${formObject?.email2}`;

	onMount(() => {
		if (route.includes('edit')) {
			method = 'PUT';
		} else {
			method = 'POST';
		}
	});

	function handleEnhance({ formElement, formData, action, cancel, submitter }) {
		let { search } = action;
		validationErrors = {};
		saved = !saved;
		Object.keys(formObject)?.forEach((key) => {
			formData.set(key, formObject[key]);
		});
		formData.set('phoneNumber', `${formObject?.phoneno1};${formObject?.phoneno2}`);
		formData.set('email', `${formObject?.email1};${formObject?.email2}`);
		formData.set('method', method);

		return async ({ result, update }) => {
			await result;
			// `result` is an `ActionResult` object
			if (search == '?/final') {
				if (!Object.keys(result?.data)?.includes('error')) {
					if (method === 'POST') {
						goto(`/nar`, { invalidateAll: true });
						message.set('Successfully added NAR Details.');
					}
					if (method === 'PUT') {
						goto(`/nar`, { invalidateAll: true });
						message.set('Successfully edited NAR Details.');
					}
				} else {
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

	<div class="flex justify-center items-center mb-4 lg:mb-6 text-xs lg:text-sm font-noto">
		<div class="flex flex-col">
			<span
				class="flex justify-center border-2 px-2 py-0.5 lg:px-2 lg:py-1 rounded-full text-xs lg:text-sm self-center h-6 w-6 lg:h-8 lg:w-8"
				class:font-semibold={!saved}>1</span
			>
			<span class="text-xs sm:text-sm">NAR Details</span>
		</div>

		<div class=" w-20 border-t lg:border-t-2 border-darkGray border-dashed self-center">&nbsp;</div>

		<div class="flex flex-col">
			<span
				class="flex justify-center border-2 lg:py-1 lg:px-2 rounded-full self-center h-6 w-6 lg:h-8 lg:w-8"
				class:bg-green-900={saved}
				class:text-white={saved}>✓</span
			>
			<span class="text-xs sm:text-sm">Completed</span>
		</div>
	</div>
	<!-- <form method="post" action="/courses" use:enhance={handleEnhance}>
		{#if !saved}
			<div>
				<h2 class="mb-4 font-semibold">National Academy for RUDSETI</h2>
			</div>

			<div class="grid grid-cols-1 items-start justify-center gap-2 mb-4 2-full lg:w-3/4">
				<TextDescriptionField
				label={'Address'}
				placeholder={'Enter NAR address'}
				name={'address'}
				bind:value={formObject.address}
				required
			/>
			
					<div class="w-full">
						<InputField
							label={'Phone Number 1'}
							placeholder={'Enter phone number'}
							name={'phoneno1'}
							bind:value={formObject.phoneno1}
							required
						/>
					</div>
					<div class="w-full ">
						<InputField
							label={'Phone Number 2'}
							placeholder={'Enter phone number'}
							name={'phoneno2'}
							type="number"
							bind:value={formObject.phoneno2}
							required
						/>
					</div>
					<div class=" ">
						<InputField
							label={'Email 1'}
							placeholder={'Enter email'}
							name={'email1'}
							type="email"
							bind:value={formObject.email1}
							required
						/>
					</div>

					<div class="">
						<InputField
							label={'Email 2'}
							placeholder={'Enter email'}
							name={'email2'}
							type="email"
							bind:value={formObject.email2}
							required
						/>
					</div>
				</div>

		{:else}
			<div class="w-full">
				<ReviewForm>
					<div class="flex flex-col gap-3">
						<div class="text-base font-semibold">National Academy for RUDSETI</div>
						<div>Address:{formObject?.address ?? '-'}</div>
						<div>Phone:{phoneno ?? '-'}</div>
						<div>Email:{email ?? '-'}</div>
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
	</form> -->

	<form method="post" action="/courses" use:enhance={handleEnhance}>
		<div class="w-full md:w-3/4 mx-auto grid grid-cols-1 gap-4 mb-4">
			{#if !saved}
				<div>
					<h2 class=" text-sm sm:text-base font-semibold text-center">National Academy for RUDSETI</h2>
				</div>
	
				<TextDescriptionField
					label={'Address'}
					placeholder={'Enter NAR address'}
					name={'address'}
					bind:value={formObject.address}
					required
				/>
	
				<InputField
					label={'Phone Number 1'}
					placeholder={'Enter phone number'}
					name={'phoneno1'}
					bind:value={formObject.phoneno1}
					required
				/>
	
				<InputField
					label={'Phone Number 2'}
					placeholder={'Enter phone number'}
					name={'phoneno2'}
					type="number"
					bind:value={formObject.phoneno2}
					required
				/>
	
				<InputField
					label={'Email 1'}
					placeholder={'Enter email'}
					name={'email1'}
					type="email"
					bind:value={formObject.email1}
					required
				/>
	
				<InputField
					label={'Email 2'}
					placeholder={'Enter email'}
					name={'email2'}
					type="email"
					bind:value={formObject.email2}
					required
				/>
			{:else}
				<div>
					<ReviewForm>
						<div class=" text-sm sm:text-base font-semibold mb-4 sm:mb-3 ">National Academy for RUDSETI</div>
						<div class="flex flex-col gap-2">
							<div class="w-full md:w-3/4 leading-relaxed"><span class="font-semibold">Address</span>: {formObject?.address ?? '-'}</div>
							<div><span class="font-semibold">Phone</span>: {formObject?.phoneno1 ?? '-'}, {formObject?.phoneno2 ?? '-'}</div>
							<div><span class="font-semibold">Email</span>: {formObject?.email1 ?? '-'}, {formObject?.email2 ?? '-'}</div>
						</div>
					</ReviewForm>
				</div>
			{/if}
	
			<div class="flex justify-end gap-4">
				{#if saved}
					<button
						type="button"
						class="rounded-md bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-darkgray border-2 shadow-sm"
						on:click={handlePrevious}
					>
						Previous
					</button>
				{:else}
					<button
						type="button"
						class="rounded-md bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-darkgray border-2 shadow-sm"
						on:click={handleGoBack}
					>
						Cancel
					</button>
				{/if}
	
				<button
					class="rounded-md bg-darkGray px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm"
					type="submit"
					formaction={saved ? '?/final' : '?/review'}
				>
					{saved ? 'Submit' : 'Save & Next'}
				</button>
			</div>
		</div>
	</form>
	
</div>
