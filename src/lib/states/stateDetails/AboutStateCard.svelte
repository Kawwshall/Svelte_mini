<script>
	export let stateDetails = {};
    let phoneNumberArray=stateDetails?.phoneNumber?.split(',')
	let phoneNumber1=phoneNumberArray[0]
	let phoneNumber2=phoneNumberArray[1]
	let emailArray=stateDetails?.email?.split(',')
	let email1=emailArray[0]
	let email2=emailArray[1]
</script>

	<div
		class="flex flex-col border-2 text-sm p-4 rounded-lg gap-4 text-darkGray border-gray-10 leading-relaxed"
	>
		<div>
			<div class="flex gap-1 items-center mb-4">
				<div class="text-base font-bold capitalize">{stateDetails?.name ?? ''}</div>
				<a href={`/states/edit?data=` + encodeURIComponent(JSON.stringify(stateDetails))}>
					<img src="/edit.svg" alt="icon for edit" />
				</a>
			</div>
			<div class="flex gap-5">
				<div class="flex flex-col gap-4">
                    <div>
                        <div class="text-sm">Address: </div>
                        <div class="text-sm">{stateDetails?.address ?? '-'}</div>
                    </div>
					<div>
					<div class="text-sm">Phone: </div>
					<div>
					<div class="text-sm"> {phoneNumber1 ?? '-'}</div>
					<div class="text-sm">{phoneNumber2 ?? '-'}</div>
				</div>
			</div>
				</div>
				<div>
				<div class="text-sm">Email:  </div>
				<div class="text-sm">{email1 ?? '-'}</div>
				<div class="text-sm"> {email2 ?? '-'}</div>
			</div>
			</div>
		</div>
	</div>

