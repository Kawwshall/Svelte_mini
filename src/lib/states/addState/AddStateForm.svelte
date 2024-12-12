<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { message } from '/src/routes/states/stateStore.js';
	import InputField from '$lib/components/InputField.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import SubmissionErrorMessage from '$lib/components/SubmissionErrorMessage.svelte';
	import Address from '$lib/components/Address.svelte';
	import ReviewForm from '$lib/components/ReviewForm.svelte';

	export let route;
	export let params;
	export let formObject = {
		titleEn: '',
		titleHi:'',
		email1: '',
		email2: '',
		phoneno1: '',
		phoneno2: '',
		addressLine1: '',
		addressLine2: '',
		cityTown: '',
		pincode: '',
		languageCode: 'en',
		uuid: '',
		method: ''
	};

	let saved = false;
	let validationErrors = {};
	let creationError = false;
	let method = 'post';
	
	$:addressParts = [
  	formObject?.addressLine1,
  	formObject?.addressLine2,
  	formObject?.cityTown,
  	formObject?.pincode
	];

	// Filter out empty, undefined, or null values
	$:address = addressParts.filter(Boolean).join(', ');
	$:phoneno = `${formObject?.phoneno1},${formObject?.phoneno2}`;
	$:email = `${formObject?.email1},${formObject?.email2}`;

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
        formData.set('address',`${formObject?.addressLine1}, ${formObject?.addressLine1},${formObject?.cityTown}, ${formObject?.pincode}`)
		formData.set('phoneno', `${formObject?.phoneno1};${formObject?.phoneno2}`);
		formData.set('email', `${formObject?.email1};${formObject?.email2}`);
		formData.set('method', method);


		return async ({ result, update }) => {
			await result;
			// `result` is an `ActionResult` object
			if (search == '?/final') {
				if(result?.data){
				if (!Object.keys(result?.data)?.includes('error')) {
					if (method === 'POST') {
						goto(`/states`, { invalidateAll: true });
						message.set('State added successfully!');
					}
					if (method === 'PUT') {
						goto(`/states`, { invalidateAll: true });
						message.set('State edited successfully!');
					}
				} else {
					creationError = true;
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
			<span class="text-xs lg:text-sm">State Details</span>
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
				<!-- First Row -->
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-20 mb-2 lg:mb-4">
					<div class="w-full mt-2">
						<InputField
							label={'State/UT (in English)'}
							placeholder={'Enter State/UT name in English'}
							name={'title'}
							bind:value={formObject.titleEn}
							required
						/>
					</div>

					<div class="w-full mt-2">
						<InputField
							label={'State/UT (in Hindi)'}
							placeholder={'Enter State/UT name in Hindi'}
							name={'title'}
							bind:value={formObject.titleHi}
							required
						/>
					</div>
				</div>
			</div>

			<hr class="my-6 border-t border-darkGray w-full" />

			<!-- Second Row -->
			<div class="grid grid-cols-1 lg:grid-cols-2 items-start mb-2 lg:mb-4 gap-2 lg:gap-20">
				<Address
					fieldName="Address"
					addressLabel="Address"
					bind:addressLine1={formObject.addressLine1}
					bind:addressLine2={formObject.addressLine2}
					bind:cityTown={formObject.cityTown}
					bind:pincode={formObject.pincode}
					showStateDropDown={false}
				/>
				<div>
					<div class="w-full mb-2 lg:mb-4">
						<InputField
							label={'Phone Number 1'}
							placeholder={'Phone Number 1'}
							name={'phoneno1'}
							bind:value={formObject.phoneno1}
							required
						/>
					</div>
					<div class="w-full mb-2 lg:mb-4">
						<InputField
							label={'Phone Number 2'}
							placeholder={'Enter phone number'}
							name={'phoneno2'}
							type="number"
							bind:value={formObject.phoneno2}
						/>
					</div>
					<div class="mb-2 lg:mb-4">
						<InputField
							label={'Email 1'}
							placeholder={'Enter email'}
							name={'email1'}
							type="email"
							bind:value={formObject.email1}
							required
						/>
					</div>

					<div class="mb-2 lg:mb-4">
						<InputField
							label={'Email 2'}
							placeholder={'Enter email'}
							name={'email2'}
							type="email"
							bind:value={formObject.email2}
						/>
					</div>
				</div>
			</div>
		{:else}
			<div class="mb-2 lg:mb-4 w-full">
				<ReviewForm>
					<div class="flex flex-col gap-3">
					<div class="text-base font-semibold">{formObject?.title}</div>
					<div>Address: {address ?? '-'}</div>
					<div>Phone: {phoneno ?? '-'}</div>
					<div>Email: {email ?? '-'}</div>
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
