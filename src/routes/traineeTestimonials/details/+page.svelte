<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import ReviewForm from '$lib/components/ReviewForm.svelte';
	import RadioButton from '$lib/components/RadioButton.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	export let data;

	const { testimonialDetails, coursesData } = data
	let selectedLanguage = 'en'; 
	let selectedTranslation = {};
	let courseName = ''
	$:error=testimonialDetails?.error?true:false;

	$: coursesList = coursesData?.flatMap((course) => {
    if (!course.uuid) return []; // Return early if uuid is missing
    const translations = course.translations
        .filter((translation) => ['en', 'hi'].includes(translation.languageCode))
        .reduce((acc, translation) => {
            acc[translation.languageCode] = translation.title;
            return acc;
        }, {});
    return {
        id: course.uuid,
        name_en: translations.en,
        name_hi: translations.hi
    };
});

$: {
    const course = coursesList?.find((c) => c.id === testimonialDetails?.courseUuid);
    courseName = selectedLanguage === 'hi' ? course?.name_hi : course?.name_en || '';
}

	// Handle language selection from the radio button
	function handleLanguageSelectionFromRadioButton(e) {
		selectedLanguage = e.detail;
		updateSelectedTranslation();
	}

	// Update selected translation based on the selected language
	function updateSelectedTranslation() {
		selectedTranslation =
			testimonialDetails.translations?.find((t) => t.languageCode === selectedLanguage) || {};
	}

	// Initialize the selected translation
	$: testimonialDetails && updateSelectedTranslation();
</script>

<div class="mb-4 mx-6 mt-2">
	<BreadCrumbs route={$page.route.id} params={$page.params} />
</div>
{#if !error}
<div class="mx-6">
	<h1 class="mb-2 font-semibold">Trainee Testimonial Details</h1>
</div>

<div class="mx-6 mb-8">
	<ReviewForm>

			<div class="flex flex-col-reverse sm:flex-row">
				<div class="w-full sm:w-3/4">
				<div class="mb-2">
					<div class="space-y-1">
						<p class="flex gap-2 font-semibold">
							Name: {selectedTranslation?.name ?? '-'}

							<a
								href={`/traineeTestimonials/edit?data=` +
									encodeURIComponent(JSON.stringify(testimonialDetails))}
							>
								<img src="/edit.svg" alt="Edit" class="w-5 h-5" />
							</a>
						</p>
						<p class="text-sm">Designation: {selectedTranslation?.designation ?? '-'}</p>
						<p class="text-sm">Place: {selectedTranslation?.place ?? '-'}</p>
						<p class="text-sm">Course: {courseName ?? '-'}</p>
					</div>
				</div>
				<div class="grid grid-cols-1 sm:grid-cols-1 gap-1 mt-4">
					<p class="">
						<span class="leading-loose"> Testimonial Text: </span>
						{selectedTranslation?.testimonialText ?? '-'}
					</p>
				</div>
			</div>
			<div class="w-full sm:w-1/4">
				<RadioButton
					languageOptionOne="English"
					languageCodeOne="en"
					languageOptionTwo="Hindi"
					languageCodeTwo="hi"
					on:handleLanguageFromRadioButton={handleLanguageSelectionFromRadioButton}
				/>
			</div>
		</div>
	</ReviewForm>
</div>
{:else}
<ErrorMessage />
{/if}
