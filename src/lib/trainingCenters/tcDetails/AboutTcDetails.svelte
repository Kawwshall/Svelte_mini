<script>
	import RadioButton from '$lib/components/RadioButton.svelte';
	import Edit from '$lib/svgComponents/Edit.svelte';
	import { page } from '$app/stores';

	export let tcDetails = {};

	let languageGroup = [
		{ title: 'English', code: 'en' },
		{ title: 'Hindi', code: 'hi' }
	];
	const bankList = $page.data?.bankData;
	const stateList = $page.data?.stateData;

	let rsetiSponsorBank = '';
	let stateName = '';
	if (Array.isArray(bankList)) {
		rsetiSponsorBank = bankList?.find((t) => t.uuid == tcDetails.bankId)?.name;
	}

	if (Array.isArray(stateList)) {
		stateName = stateList?.find(
			(t) => t.extId == tcDetails.stateId && t.languageCode == 'en'
		)?.name;
	}

	export let languageSelected = languageGroup[0].code;
	// display data will contain change accordinf to language
	let displayData = {};
	$: setDisplayData(languageSelected);

	function setDisplayData(language) {
		let translatedData =
			tcDetails.translations?.find(
				(t) => t.languageCode?.trim()?.toLowerCase() === language?.trim()?.toLowerCase()
			) || {};

		displayData = {
			name: translatedData?.name || 'No data found.',
			extId: tcDetails?.extId || '-',
			stateName: stateName || '-',
			email: tcDetails?.email || '-',
			contactNo: tcDetails?.contactNo || '-',
			courseCount: tcDetails?.courseCount || '-',
			rsetiSponsorBank: rsetiSponsorBank || '-',
			directorName: translatedData?.directorName || '-',
			district: translatedData?.district || '-',
			address: translatedData?.address || '-',
			directorContactNo: tcDetails?.directorContactNo || '-'
		};
	}

	function handleLanguageSelectionFromRadioButton(e) {
		languageSelected = e.detail;

		// setDisplayData(languageSelected);
	}
</script>

<div
	class="flex flex-col text-sm p-6 rounded-lg gap-4 text-darkGray border border-gray-50 bg-white leading-relaxed"
>
	<div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
		<div class="border-orange-100 border rounded-full p-2 flex items-center justify-center">
			<img
				src="/learningCentersIcon.svg"
				alt="Learning Center"
				class="w-7 h-7 sm:w-8 sm:h-8 object-contain"
			/>
		</div>
		<div>
			<div class="flex gap-2 items-center">
				<h1 class="heading-L font-bold capitalize">{displayData?.name}</h1>
				<a href={'/trainingCenters/edit?data=' + encodeURIComponent(JSON.stringify(tcDetails))}>
					<Edit stroke="#FF6A1F" /></a
				>
			</div>
			<div class="mt-1">
				<RadioButton
					languageOptionOne={'english'}
					languageCodeOne={'en'}
					languageOptionTwo={'hindi'}
					languageCodeTwo={'hi'}
					on:handleLanguageFromRadioButton={handleLanguageSelectionFromRadioButton}
				/>
			</div>
		</div>
	</div>
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
		<div class="space-y-1 sm:col-span-1">
			<div>
				<span class="label">RSETI Id:</span> <span>{displayData.extId}</span>
			</div>
			<div>
				<span class="label">Sponsor bank :</span>
				<span>{displayData.rsetiSponsorBank ? displayData.rsetiSponsorBank : '-'}</span>
			</div>
			<div>
				<span class="label">State :</span> <span>{displayData.stateName}</span>
			</div>
			<div>
				<span class="label">Director&apos;s name :</span>
				<span>{displayData.directorName ? displayData.directorName : ''}</span>
			</div>
		</div>
		<div class="space-y-1 sm:col-span-2">
			<div>
				<span class="label">Phone :</span> <span>{displayData.contactNo}</span>
			</div>
			<div>
				<span class="label">Director&apos;s phone no. :</span>
				<span>{displayData.directorContactNo}</span>
			</div>
			<div>
				<span class="label">Email :</span> <span>{displayData.email}</span>
			</div>
			<div>
				<span class="label">Address :</span> <span>{displayData.address}</span>
			</div>
		</div>
	</div>
</div>
