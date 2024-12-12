<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import ReviewForm from '$lib/components/ReviewForm.svelte';
	import RadioButton from '$lib/components/RadioButton.svelte';
	import { getFAQCategoryName } from '$lib/utils/helper.js';

	export let data;

	const { testimonialDetails } = data;
	let selectedLanguage = 'en'; // Default selected language
	// Track selected translation details
	let selectedTranslation = {};
	
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
<div class="mx-6">
	<h1 class="mb-2 font-semibold">Official Testimonial Details</h1>
</div>

<div class="mx-6 mb-8">
	<ReviewForm>
		<div class="flex flex-col md:flex-row gap-3 md:gap-5">
			<div class="w-fit sm:w-1/2 md:w-1/4 flex-shrink-0 order-2 md:order-1">
				<img
					class="w-full h-48 rounded-lg shadow-sm object-contain"
					src={testimonialDetails?.image ? `${testimonialDetails?.image}?t=${Date.now()}` : '/image-preview-icon.jpg'}
					alt="Display thumbnail"
				/>
			</div>
			<div class="flex-grow order-3 md:order-2 w-full md:w-2/4">
				<div class="mb-2">
					<div class="space-y-1">
						<p class="flex gap-2 font-semibold">
							Name: {selectedTranslation?.name ?? '-'}

							<a
								href={`/officialTestimonials/edit?data=` +
									encodeURIComponent(JSON.stringify(testimonialDetails))}
							>
								<img src="/edit.svg" alt="Edit" class="w-5 h-5" />
							</a>
						</p>
						<p class="text-sm"><span class="font-semibold">Designation</span>: {selectedTranslation?.designation ?? '-'}</p>
					</div>
				</div>
				<div class="grid grid-cols-1 sm:grid-cols-1 gap-1 mt-4">
					<p class=" capitalize">
						<span class="font-semibold"> Testimonial text: </span>
						{selectedTranslation?.testimonialText ?? '-'}
					</p>
				</div>
			</div>
			<div class="order-1 md:order-3 text-nowrap">
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
