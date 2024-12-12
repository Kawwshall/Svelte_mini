<script>
	import InputField from '$lib/components/InputField.svelte';
	import Filter from '$lib/components/Filter.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { message } from '/src/routes/courses/courseStore.js';

	export let data;
	let tcDataJSON = $page.url.searchParams.get('data');
	let tcData = JSON.parse(tcDataJSON);

	const { courseList } = data;

	let courseOptionsList = Object.values(courseList);
	let courseOptionValue = '';
	let errorMessage = '';
	let courseOptionListConfigObject = {
		optionNameKey: 'title',
		optionIdKey: 'uuid'
	};

	let trainerOptionsList = [
		{ title: 'Trainer 1', uuid: '321231231' },
		{ title: 'Trainer 2', uuid: 'dasd23212312' }
	];
	let trainerOptionValue = '';
	let trainerOptionListConfigObject = {
		optionNameKey: 'title',
		optionIdKey: 'uuid'
	};

	let courseObject = {
		courseUuid: '',
		startDate: '',
		endDate: ''
	};

	function handleGoBack() {
		window.history.back();
	}

	function handleEnhance({ formElement, formData, action, cancel, submitter }) {
		const course = courseOptionsList.find(
			(course) => course.title?.trim() === courseOptionValue?.trim()
		);
		if (!course) {
			alert('Please select a valid course!');
			cancel();
			return;
		}

		const startDate = new Date(courseObject.startDate);
		const endDate = new Date(courseObject.endDate);
		if (endDate < startDate) {
			errorMessage = 'End date cannot be earlier than the start date.';
			cancel();
			return;
		}
		// Set JSON fields
		const postData = [
			{
				courseUuid: course.uuid,
				startYear: startDate.getFullYear(),
				startMonth: startDate.getMonth() + 1, // getMonth() is zero-based
				endYear: endDate.getFullYear(),
				endMonth: endDate.getMonth() + 1
			}
		];

		// Attach to formData for submission
		formData.set('postData', JSON.stringify(postData));
		formData.set('rsetiUUID', tcData.uuid);

		return async ({ result, update }) => {
			await result;
			if (result.type === 'success') {
				const courseName = course.title;
				const rsetiName = tcData?.translations?.[0]?.name ?? '';
				goto('/trainingCenters/details?data=' + encodeURIComponent(JSON.stringify(tcData)), {
					invalidateAll: true
				});
				message.set(
					`Successfully added the course "${courseName}" to the "${rsetiName}" training center!`
				);
			} else {
				alert('Failed to submit data.');
			}
		};
	}
</script>

<div class="m-4">
	<div class="mb-6">
		<BreadCrumbs route={$page.route.id} params={$page.params.id} />
	</div>
	<h2 class="mb-4 font-semibold">
		Add Course to {tcData?.translations[0]?.name}
	</h2>
	<form
		method="post"
		action="?/final"
		class="sm:w-1/2 flex flex-col gap-4"
		use:enhance={handleEnhance}
	>
		<div>
			<h3 class="text-sm font-medium leading-6 text-gray-900">Select Course</h3>
			<Filter
				name="courseName"
				inputBoxClass="bg-white"
				addClass="border rounded-md"
				placeholder="-- Select a course ---"
				bind:itemSelected={courseOptionValue}
				optionList={courseOptionsList}
				optionListConfigObject={courseOptionListConfigObject}
				required={true}
			/>
		</div>
		<div>
			<h3 class="text-sm font-medium leading-6 text-gray-900">Trainer Name</h3>
			<Filter
				name="trainerName"
				inputBoxClass="bg-white"
				addClass="border rounded-md"
				placeholder="-- Select a trainer ---"
				bind:itemSelected={trainerOptionValue}
				optionList={trainerOptionsList}
				optionListConfigObject={trainerOptionListConfigObject}
				required={true}
			/>
		</div>
		<InputField
			label={'Start Date'}
			type="month"
			name={'startDate'}
			required
			bind:value={courseObject.startDate}
		/>
		<InputField
			label={'End Date'}
			type="month"
			name={'endDate'}
			required
			bind:value={courseObject.endDate}
		/>
		{#if errorMessage}
			<p class="text-red-500 text-sm">{errorMessage}</p>
		{/if}
		<div class="flex justify-end gap-4">
			<button
				type="button"
				class="rounded-md bg-white px-4 py-2 text-sm font-semibold text-darkgray border-2 shadow-sm"
				on:click={handleGoBack}>Previous</button
			>

			<button
				class="rounded-md bg-darkGray px-4 py-2 text-sm font-semibold text-white shadow-sm"
				type="submit"
				>Submit
			</button>
		</div>
	</form>
</div>
