<script>
	import { enhance } from '$app/forms';

	import DropDown from '$lib/components/DropDown.svelte';
	import InputField from '$lib/components/InputField.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import Address from '$lib/components/Address.svelte';
	import CheckBox from '$lib/components/CheckBox.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import ReviewEditUserForm from '$lib/users/editUser/ReviewEditUserForm.svelte';

	// --- FEATURES THAT WILL FAIL IN FORM ACTION ---
	// 1. Uploading image and then previewing it depends on js
	// 2. populating current address and permanent address if both are same
	// 3. All drop downs depend on JS
	// 4. Previous and Go back both wont work as they are handled by JS handelGoBack

	// basic data props
	export let stateOptionList = [];
	export let form;
	export let route;
	export let params;

	// get user data from apis
	export let userData = {};
	let formObject = userData;

	// declare basic variables 
	let saved = form?.saved ?? false;
	let displayImage = null;
	let currentAddressSameAsPermanent = formObject?.currentAddressSameAsPermanent ?? false;
	let despatch = createEventDispatcher();

	// check if current address same or not
	$: {
		if (currentAddressSameAsPermanent) {
			handleCurrentAddressSameAsPermanent(formObject);
		}
	}
	
	function handleCurrentAddressSameAsPermanent() {
		formObject.currentAddressLine1 = formObject.permanentAddressLine1;
		formObject.currentAddressLine2 = formObject.permanentAddressLine2;
		formObject.currentAddressCityTown = formObject.permanentAddressCityTown;
		formObject.currentAddressPincode = formObject.permanentAddressPincode;
		formObject.currentAddressState = formObject.permanentAddressState;
	}

	// image handeling functions
	let imageUploadInputRef;
	function handelUploadImage() {
		imageUploadInputRef.click();
	}

	async function handleImageChange(event) {
		const imageFile = event.target?.files[0];
		// console.log("thype of user ufge", imageFile instanceof Blob )
		displayImage = imageFile;
		formObject.userImage = displayImage;
	}


	// list of role options passed to the role dropdown
	let roleOptions = [
		{
			name: 'Role 1'
		},
		{
			name: 'Role 2'
		}
	];

	// main form object
	// let formObject = {
	// 	userId: '',
	// 	userName: '',
	// 	userDesignation: '',
	// 	userRole: '',
	// 	userPhoneNumber: '',
	// 	userEmail: '',
	// 	userImage: '',
	// 	permanentAddressLine1: '',
	// 	permanentAddressLine2: '',
	// 	permanentAddressCityTown:'',
	// 	permanentAddressState: '',
	// 	permanentAddressPincode: '',
	// 	currentAddressLine1: '',
	// 	currentAddressLine2: '',
	// 	currentAddressCityTown:'',
	// 	currentAddressState: '',
	// 	currentAddressPincode:''
	// };

	// drop down controller
	function handleDropDown(e) {
		const dropDownDetails = e.detail;
		if (dropDownDetails?.type === 'Role') {
			formObject.userRole = dropDownDetails.selectedItemName;
		}
	}

	// js submit function 
	function handleSubmit() {
		despatch('userData', formObject);
		// console.log("handle submit reached")
		saved = true;
		// TODO write logic for api submittion of form 
	}

	// js handlers for back navigation
	function handleGoBack() {
		if (saved) {
			saved = !saved;
		} else {
			window.history.back();
		}
	}

	// --- From Action: Use Enhance function ---
	function userFormEnhancement({ formElement, formData, action, cancel, submitter }) {
		let { search } = action;
		// setting all the non-input tag input fields in the form data
		formData.set('permanentAddressState', formObject?.permanentAddressState);
		formData.set('currentAddressState', formObject?.currentAddressState);
		formData.set('userRole', formObject?.userRole);

		return async ({ result, update }) => {
			// `result` is an `ActionResult` object
			// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
			// moving to saved state if the form is saved in the backend
			if (search === '?/review') {
				if (result.type == 'success') {
					saved = true;
				}

				// since user image is not returned in form response save it if JS is available
				let userImage = formObject.userImage;

				// update the form object with the returned data
				formObject = result.data?.formData;
				// add user image data back to form object
				formObject.userImage = userImage;
				// update the `form`
				form = { formData: formObject };

				// run default update logic
				update();
			}
			if (search === '?/final') {
				saved = !saved;
				// handle saving and not saving when apis are integrated
			}
		};
	}
</script>

<div class="m-4 lg:m-12 text-primary">
	<!-- Bread Crumbs -->
	<div class="mb-6 lg:mb-0">
		<BreadCrumbs {route} {params} />
	</div>
	<!-- Form Step Component -->
	<div class="flex justify-center items-center mb-6 lg:mb-4 text-sm font-noto">
		<div class="flex flex-col">
			<span
				class="flex justify-center border-2 px-2 py-0.5 lg:px-2 lg:py-1 rounded-full text-xs lg:text-sm self-center h-6 w-6 lg:h-8 lg:w-8"
				class:font-semibold={!saved}>1</span
			>
			<span class="text-xs lg:text-sm">User Details</span>
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
		enctype="multipart/form-data"
	>
		<!-- To be used while doing review add course -->
		<div>
			{#if !saved}
				<h2 class="mb-2 font-semibold">Edit User</h2>
				<!-- First Row -->

				<div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-20 gap-y-6 mb-2 lg:mb-12">
					<div class="flex flex-col gap-6">
						<div class="w-full">
							<InputField
								label={'Name *'}
								placeholder={'Name'}
								bind:value={formObject.userName}
								type="text"
								name="userName"
								required
							/>
						</div>
						<div class="w-full">
							<InputField
								label={'User ID *'}
								placeholder={'User ID'}
								bind:value={formObject.userId}
								type="text"
								name="userId"
								required
							/>
						</div>
						<div class="w-full">
							<InputField
								label={'Designation'}
								type="text"
								name="userDesignation"
								placeholder={'Enter user desgination'}
								bind:value={formObject.userDesignation}
							/>
						</div>
					</div>

					<div class="w-full sm:col-span-1 flex flex-col items-center justify-center gap-4">
						<img
							class="w-28 h-28 rounded-full border object-cover"
							src={displayImage ? URL.createObjectURL(displayImage) : '/placeholderUserImage.png'}
							alt="uploaded user profile"
						/>

						<button
							type="button"
							on:click={handelUploadImage}
							class="flex items-center gap-2 px-4 py-2 border border-gray-90 rounded-lg text-darkGray"
							><span class="material-icons-outlined text-center">upload_file</span> Profile Photo</button
						>
						<input
							type="file"
							name={'userImage'}
							bind:this={imageUploadInputRef}
							on:change={handleImageChange}
							class="hidden"
						/>
					</div>

					<div class="sm:col-span-2 grid grid-cols-2 sm:gap-x-20">
						<div class="w-full">
							<DropDown
								title="Role"
								options={roleOptions}
								type={'Role'}
								on:handleDispatchFilterData={handleDropDown}
								bind:selectedItemName={formObject.userRole}
							/>
						</div>
					</div>

					<div class="sm:col-span-2 grid sm:grid-cols-2 sm:gap-x-20 gap-y-6">
						<div class="w-full">
							<InputField
								name="userPhoneNumber"
								label={'Phone Number'}
								placeholder={'Enter user phone number'}
								bind:value={formObject.userPhoneNumber}
							/>
						</div>
						<div class="w-full">
							<InputField
								label={'Email'}
								name="userEmail"
								placeholder={'Enter user email'}
								bind:value={formObject.userEmail}
							/>
						</div>
					</div>

					<Address
						fieldName="Permanent Address"
						addressLabel="permanentAddress"
						stateData={stateOptionList}
						bind:addressLine1={formObject.permanentAddressLine1}
						bind:addressLine2={formObject.permanentAddressLine2}
						bind:cityTown={formObject.permanentAddressCityTown}
						bind:state={formObject.permanentAddressState}
						bind:pincode={formObject.permanentAddressPincode}
					/>

					<Address
						fieldName="Current Address"
						readonly={currentAddressSameAsPermanent}
						stateData={stateOptionList}
						addressLabel="currentAddress"
						bind:addressLine1={formObject.currentAddressLine1}
						bind:addressLine2={formObject.currentAddressLine2}
						bind:cityTown={formObject.currentAddressCityTown}
						bind:state={formObject.currentAddressState}
						bind:pincode={formObject.currentAddressPincode}
					/>

					<CheckBox
						bind:checked={currentAddressSameAsPermanent}
						checkBoxDiscription="Current address same as permanent address"
					/>
				</div>
				<!-- <button class="border bg-gray-30 p-4" type="submit">
				Submit
			</button> -->
				<!-- Second Row -->

				<!-- To be used while doing review add course component -->
			{:else}
				<div class="mb-4 lg:mb-12 w-full">
					<ReviewEditUserForm {saved} userData={form?.formData || formObject} />
				</div>
			{/if}

			<div class="flex justify-end gap-4">
				{#if saved}
					<button
						type="button"
						class="rounded-md bg-white px-4 py-2 text-sm font-semibold text-darkgray border-2 shadow-sm"
						on:click={handleGoBack}>Previous</button
					>
					<button
						class="rounded-md bg-darkGray px-4 py-2 text-sm font-semibold text-white shadow-sm"
						on:click={handleSubmit}>Submit</button
					>
				{:else}
					<button
						type="button"
						class="rounded-md bg-white px-4 py-2 text-sm font-semibold text-darkgray border-2 shadow-sm"
						on:click={handleGoBack}>Cancel</button
					>
					<button
						class="rounded-md bg-darkGray px-4 py-2 text-sm font-semibold text-white shadow-sm"
						on:click={handleSubmit}
						>Save & Next</button
					>
				{/if}
			</div>
		</div>
	</form>
</div>
