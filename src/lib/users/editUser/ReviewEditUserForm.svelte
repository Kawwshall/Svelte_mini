<script>
	export let userData = {
		userId: '12344',
		userName: 'Arun Shreekumar',
		userDesignation: 'Manager',
		userRole: 'NAR Admin',
		userPhoneNumber: '2983849103',
		userEmail: 'testing@gamil.com',
		permanentAddressLine1: 'near ABC, XYZ',
		permanentAddressLine2: 'LJH Road',
		permanentAddressCityTown: 'Mohali',
		permanentAddressState: 'Punjab',
		permanentAddressPincode: '120031',
		currentAddressLine1: 'near ABC, XYZ',
		currentAddressLine2: 'LJH Road',
		currentAddressCityTown: 'Mohali',
		currentAddressState: 'Punjab',
		currentAddressPincode: '120031',
		currentAddressSameAsPermanent:false
		
	};
	// console.log("this is type of user image", typeof userData.userImage)
	export let saved;
	function handlePrevious() {
		saved = !saved;
	}
</script>

<h2 class="mb-2 font-semibold">2. Review user details</h2>

<div
	class="w-full border rounded-lg flex flex-col-reverse sm:flex-row p-4 text-sm text-black font-normal justify-between"
>
	<div class="leading-[22px]">
		<h1 class="font-bold mb-2">{userData.userName}</h1>
		<h1>id: {userData.userId}</h1>
		<h1>Phone: {userData.userPhoneNumber}</h1>
		<h1>Email: {userData.userEmail}</h1>

		<h1 class="mt-2">Address:</h1>
		<h1>
			{userData.permanentAddressLine1}, {userData.permanentAddressLine2}
		</h1>
		<h1>{userData.permanentAddressCityTown}, {userData.permanentAddressState}</h1>
		<h1>{userData.permanentAddressPincode}</h1>
		{#if !userData?.currentAddressSameAsPermanent}
			
		<h1 class="mt-2">Current Address:</h1>
		<h1>
			{userData.currentAddressLine1}, {userData.currentAddressLine2}
		</h1>
		<h1>{userData.currentAddressCityTown}, {userData.currentAddressState}</h1>
		<h1>{userData.currentAddressPincode}</h1>
		{/if}
	</div>
	<div class="flex flex-col justify-center sm:items-center leading-[22px]">
		<div class="flex justify-center">
			<img
			class="w-28 h-28 rounded-full border object-cover mb-2"
			src={ userData.userImage instanceof Blob ? URL.createObjectURL(userData.userImage):"/placeholderUserImage.png"}
			alt="uploaded user profile"
		/>
		</div>
		
		<h1>Designation: {userData.userDesignation}</h1>
		<h1>Role: {userData.userRole}</h1>
	</div>
</div>
