<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import BreadCrumbs from '$lib/components/BreadCrumbs.svelte';
	import ReviewForm from '$lib/components/ReviewForm.svelte';
	import RadioButton from '$lib/components/RadioButton.svelte';
	import { getFAQCategoryName } from '$lib/utils/helper.js';
	export let data;
	const { faqDetails } = data;
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
			faqDetails.translations?.find((t) => t.languageCode === selectedLanguage) || {};
		selectedTranslation.categoryName = getFAQCategoryName(faqDetails.categoryId);
	}

	// Initialize the selected translation
	$: faqDetails && updateSelectedTranslation();
</script>

<div class="mb-4 mx-6 mt-2">
	<BreadCrumbs route={$page.route.id} params={$page.params} />
</div>
<div class="mx-6">
	<h1 class="mb-2 font-semibold">FAQ Details</h1>
</div>

<div class="mx-6 mb-8">
	<ReviewForm>
		<div class="flex flex-col md:flex-row gap-6">
			<div class="flex-grow">
				<div class="mb-2">
					<div class="space-y-1">
						<p class="flex gap-2 font-semibold">
							Q: {selectedTranslation?.question ?? '-'}

							<a href={`/FAQs/edit?data=` + encodeURIComponent(JSON.stringify(faqDetails))}>
								<img src="/edit.svg" alt="Edit" class="w-5 h-5" />
							</a>
						</p>
						<p class="text-sm">A: {selectedTranslation?.answer ?? '-'}</p>
					</div>
				</div>
				<div class="grid grid-cols-1 sm:grid-cols-1 gap-1 mt-4">
					<p class=" capitalize">
						<span class="font-semibold"> FAQ Category: </span>
						{selectedTranslation?.categoryName ?? '-'}
					</p>
				</div>
			</div>
			<div class="basis-[20%]">
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
