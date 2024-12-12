<script>
	import { page } from '$app/stores';
	import AddFAQForm from '$lib/faqs/AddFAQForm.svelte';
	import { getFAQCategoryName } from '$lib/utils/helper.js';

	export let data;
	const { FAQData } = data;
	let formObject = {};

	populateFormObject(FAQData);

	// Populate formObject with data for both languages
	function populateFormObject(faq) {
		const enTranslation = faq.translations?.find((t) => t.languageCode.toLowerCase() === 'en');
		const hiTranslation = faq.translations?.find((t) => t.languageCode.toLowerCase() === 'hi');
		let categoryName = '';
		if (faq?.categoryId) {
			categoryName = getFAQCategoryName(faq?.categoryId) ?? '';
		}

		formObject = {
			// Common fields
			uuid: faq?.uuid,
			categoryId: faq?.categoryId,
			categoryName: categoryName,
			// English translation
			questionEn: enTranslation?.question || '',
			answerEn: enTranslation?.answer || '',

			// Hindi translation
			questionHi: hiTranslation?.question || '',
			answerHi: hiTranslation?.answer || '',
			method: 'PUT'
		};
	}
</script>

<AddFAQForm route={$page.route.id} params={$page.params} {formObject} />
