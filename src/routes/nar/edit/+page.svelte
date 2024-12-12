<script>
	import { page } from '$app/stores';
	import AddNarForm from '$lib/nar/addNar/AddNarForm.svelte';

	export let data;

	let formObject = [];
	let formDataFromQueryParams = $page.url.searchParams.get('data');

	if (formDataFromQueryParams) {
		let phoneNumberArray = [];
		let emailArray = [];

		let parsedFormDataFromQueryParams = JSON.parse(formDataFromQueryParams);

	
		if (parsedFormDataFromQueryParams?.phoneNumber) {
			phoneNumberArray = parsedFormDataFromQueryParams?.phoneNumber.split(';');
		}
		if (parsedFormDataFromQueryParams?.email) {
			emailArray = parsedFormDataFromQueryParams?.email.split(';');
		}
		formObject = {
			address:parsedFormDataFromQueryParams?.address,
			phoneno1: phoneNumberArray[0],
			phoneno2: phoneNumberArray[1],
			email1: emailArray[0],
			email2: emailArray[1],
			uuid: parsedFormDataFromQueryParams?.uuid
		};
	}
</script>

<AddNarForm route={$page.route.id} params={$page.params} {formObject} stateData={data?.stateData} />
