<script>
	import { page } from '$app/stores';
	import EditUserForm from '$lib/users/editUser/EditUserForm.svelte';
	import placeholderImage from '../../../../static/videoThumbnail.png';
	let route = $page.route.id;
	let params = $page.params;
	let searchParams = $page.url.searchParams;
	let searchParamsData = JSON.parse(searchParams.get('data'));
	// Dummy data till apis are not ready
	let apiData = {
		id: 0,
		uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
		email: 'tuhi@gmail.com',
		name: searchParamsData.name,
		photoValue: ['2123231231232112312'],
		contactNo: '7475930583',
		permanentAddress: 'Street Name 1; Locality name 1; Chandigarh;Kerala; 321312',
		currentAddress: 'Street Name 1; Locality name 1; Chandigarh;Kerala; 321312',
		isPermanentAndCurrentAddressSame: true,
		status: 'DORMANT',
		role: searchParamsData.role,
		designation: searchParamsData.designation,
		createdOn: '2024-10-17T05:51:46.000Z',
		lastUpdatedOn: '2024-10-17T05:51:46.000Z'
	};

	let userData = {
		userId: '231312312',
		userName: 'Tuhinahsu',
		userDesignation: 'CEO',
		userRole: 'Grow Buisnees',
		userPhoneNumber: '12312323132',
		userEmail: 'tuhi@gmail.com',
		userImage: placeholderImage,
		permanentAddressLine1: 'Street name 1',
		permanentAddressLine2: 'Locality name 1',
		permanentAddressCityTown: 'Chandigarh',
		permanentAddressState: 'Kerala',
		permanentAddressPincode: '321312',
		currentAddressLine1: '',
		currentAddressLine2: '',
		currentAddressCityTown: '',
		currentAddressState: '',
		currentAddressPincode: '',
		currentAddressSameAsPermanent: true
	};
	function parseData(apiData) {
		userData.userName = apiData.name;
		userData.userDesignation = apiData.designation;
		userData.userId = apiData.id;
		userData.userEmail = apiData.email;
		userData.userRole = apiData.role;
		userData.userPhoneNumber = apiData.contactNo;
		userData.userImage = apiData.photoValue;
		userData.currentAddressSameAsPermanent = apiData.isPermanentAndCurrentAddressSame;

		let addressData = apiData?.permanentAddress?.split(';');
		userData.permanentAddressLine1 = addressData[0];
		userData.permanentAddressLine2 = addressData[1];
		userData.permanentAddressCityTown = addressData[2];
		userData.permanentAddressState = addressData[3];
		userData.permanentAddressPincode = addressData[4];

		if (apiData.isPermanentAndCurrentAddressSame) {
			userData.currentAddressLine1 = userData.permanentAddressLine1;
			userData.currentAddressLine2 = userData.permanentAddressLine2;
			userData.currentAddressCityTown = userData.permanentAddressCityTown;
			userData.currentAddressState = userData.permanentAddressState;
			userData.currentAddressPincode = userData.permanentAddressPincode;
		} else {
			let currentAddressData = apiData?.currentAddress?.split(';');
			userData.currentAddressLine1 = currentAddressData[0];
			userData.currentAddressLine2 = currentAddressData[1];
			userData.currentAddressCityTown = currentAddressData[2];
			userData.currentAddressState = currentAddressData[3];
			userData.currentAddressPincode = currentAddressData[4];
		}
	}
	$: parseData(apiData);

	export let form;
	export let data;
	function handleUserdata(event) {
		userData = event.details;
	}
</script>

<EditUserForm
	{route}
	{params}
	on:userData={handleUserdata}
	{form}
	stateOptionList={data?.stateData}
	{userData}
/>
