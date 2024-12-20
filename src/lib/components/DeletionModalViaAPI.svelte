<!--  This is a basic deletion modal which dispatches events based on API -->

<script>
	import { onMount, onDestroy } from 'svelte';
	import { createEventDispatcher, tick } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import DeletionErrorMessage from '$lib/components/DeletionErrorMessage.svelte';
	import LineLoader from '$lib/components/LineLoader.svelte';

	export let id;
	export let name;
	export let heading;
	export let para;
	export let code;
	export let endPoint;
	export let queryParams = '';
	export let deleteTextConfirmation = true;

	let cancelDeletion = false;
	let errorMessage = '';
	let dispatch = createEventDispatcher();
	let isSubmitting = false;

	function handleOutsideClick() {
		// Prevents any action when clicking outside the modal
		return;
	}

	function handleCancel() {
		cancelDeletion = true;
		dispatch('handleCancelDeletion', cancelDeletion);
	}

	async function handleDeletion() {
		try {
			errorMessage = '';
			isSubmitting = true;
			const response = await fetch(`${endPoint}${id}${queryParams}`, { method: 'DELETE' });

			// Handle cases where the response is 204 (No Content)
			if (!response.ok) {
				errorMessage = `Failed to delete ${name}. Please try again.`;
				throw new Error('Failed to delete item');
			}

			let result;
			try {
				result = await response.json(); // This will fail if the response is empty
			} catch (error) {
				console.warn('No JSON content in the response');
				result = {}; // Default to an empty object if there's no content
			}

			if (!result.error) {
				dispatch('handleDeletion', id);
			} else {
				errorMessage = `Failed to delete ${name}. Please try again.`;
			}
		} catch (error) {
			console.error('Error:', error);
		} finally {
			isSubmitting = false;
			if (!errorMessage) {
				handleCancel();
			}
		}
	}

	onMount(() => {
		// Disable scrolling on the main page
		document.body.style.overflow = 'hidden';
	});

	onDestroy(() => {
		// Re-enable scrolling when the modal is closed
		document.body.style.overflow = '';
	});
</script>

<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
	<div
		class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity pointer-events-none"
		aria-hidden="true"
		on:click|stopPropagation={handleOutsideClick}
	></div>

	<div class="fixed inset-0 z-10 w-screen overflow-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				class="relative transform rounded-lg bg-gray-10 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 max-h-[90vh] overflow-auto"
				on:click|stopPropagation
			>
				<div class="pb-2">
					{#if isSubmitting}
						<LineLoader />
					{/if}
				</div>

				{#if errorMessage}
					<div class="mb-4">
						<DeletionErrorMessage {errorMessage} />
					</div>
				{/if}

				<div class="sm:flex sm:items-center">
					<div
						class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
					>
						<svg
							class="h-6 w-6 text-red-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
							/>
						</svg>
					</div>
					<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1 min-w-0">
						<h3
							class="text-base font-semibold leading-6 text-red-700 break-words capitalize"
							id="modal-title"
						>
							{heading}
						</h3>
					</div>
				</div>
				<div class="mt-4">
					<p class="text-sm text-darkGray font-medium mb-2 break-words">
						{para}
					</p>
					<slot></slot>
				</div>
				<div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
					<Button
						type="button"
						btnType="danger"
						on:click={handleDeletion}
						disabled={!deleteTextConfirmation || isSubmitting}>Delete</Button
					>
					<Button type="button" btnType="secondary" disabled={isSubmitting} on:click={handleCancel}
						>Cancel</Button
					>
				</div>
			</div>
		</div>
	</div>
</div>
