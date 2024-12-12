<script>
	import InputField from '$lib/components/InputField.svelte';
	import Filter from '$lib/components/Filter.svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { message } from '/src/routes/courses/courseStore.js';

	export let data;
	const { courseList, tcData } = data;

	let courseDataJson = $page.url.searchParams.get('data');

	let courseDataURL = JSON.parse(courseDataJson);

	let courseData = courseList[courseDataURL.courseCode];

	// Prepare course fields
	let courseName = courseDataURL.name;
	let startDate = '';
	let endDate = '';
	let errorMessage = '';

	if (courseDataURL.startDate && courseDataURL.endDate) {
		const [startMonth, startYear] = courseDataURL.startDate.split(' / ');
		const [endMonth, endYear] = courseDataURL.endDate.split(' / ');

		startDate = `${startYear}-${startMonth.padStart(2, '0')}`;
		endDate = `${endYear}-${endMonth.padStart(2, '0')}`;
	}

	// Trainer options
	let trainerOptionsList = [
		{ title: 'Trainer 1', uuid: '321231231' },
		{ title: 'Trainer 2', uuid: 'dasd23212312' }
	];
	let trainerOptionValue = trainerOptionsList[0].title;
	let trainerOptionListConfigObject = {
		optionNameKey: 'title',
		optionIdKey: 'uuid'
	};

	// Go back function
	function handleGoBack() {
		window.history.back();
	}

	// Enhance function for form submission
	function handleEnhance({ formElement, formData, action, cancel, submitter }) {
		// Parse `startDate` and `endDate` into the required format
		const [startYear, startMonth] = startDate.split('-').map(Number);
		const [endYear, endMonth] = endDate.split('-').map(Number);
		if (endDate < startDate) {
			errorMessage = 'End date cannot be earlier than the start date.';
			cancel();
			return;
		}
		// Prepare submission data
		const courseSubmissionData = [
			{
				courseUuid: courseDataURL.uuid,
				startYear,
				startMonth,
				endYear,
				endMonth
			}
		];

		// Log submission data

		// Set form data for submission
		formData.set('courseUuid', courseDataURL.uuid);
		formData.set('rsetiUUID', courseDataURL.rsetiUuid);
		formData.set('courseSubmissionData', JSON.stringify(courseSubmissionData)); // Adding formatted data

		return async ({ result, update }) => {
			await result;
			if (result.type === 'success') {
				let selectedTrainingCenter = tcData.find((tc) => tc.uuid === courseDataURL.rsetiUuid);
				let rsetiName = selectedTrainingCenter?.translations?.[0]?.name || '';

				goto(
					'/trainingCenters/details?data=' +
						encodeURIComponent(JSON.stringify({ uuid: courseDataURL.rsetiUuid })),
					{ invalidateAll: true }
				);
				message.set(
					`Successfully added the course "${courseName}" to the "${rsetiName}" training center!`
				);
			}
		};
	}
</script>

<div class="m-4">
	<div class="mb-6">
		<BreadCrumbs route={$page.route.id} params={$page.params.id} />
	</div>
	<h2 class="mb-4 font-semibold">
		Edit Course {courseDataURL?.name}
	</h2>
	<form
		method="post"
		action="?/final"
		class="sm:w-1/2 flex flex-col gap-4"
		use:enhance={handleEnhance}
	>
		<div>
			<InputField
				label={'Course Name'}
				type="text"
				name={'courseName'}
				required
				readonly={true}
				bind:value={courseName}
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
			bind:value={startDate}
		/>
		<InputField label={'End Date'} type="month" name={'endDate'} required bind:value={endDate} />
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
