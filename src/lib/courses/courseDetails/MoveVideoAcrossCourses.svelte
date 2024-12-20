<script>
	import { onMount, onDestroy } from "svelte";
    import { createEventDispatcher } from 'svelte';
    import DropDown from '$lib/components/DropDown.svelte';
	import DeletionErrorMessage from '$lib/components/DeletionErrorMessage.svelte';
	import LineLoader from '$lib/components/LineLoader.svelte';
	import SearchableComboBox from '$lib/components/SearchableComboBox.svelte';
    import { tick } from "svelte";

    export let videoTitle;
    export let courseTitle;
    export let coursesList;
    export let videoUuid;
    export let video;
    export let chapterData;
    export let courseUuid;

    let dispatch = createEventDispatcher();
    let validationErrors = {};
    let chaptersList = [];
    let selectedChapterVideos = []
    let errorMessage=''
    let selectedCourseUuid = null;
    let selectedCourse = null;
    let selectedChapterUuid = null;
    let selectedChapter = null;
    let isSubmitting=false
    let failedAPICall=false
    let orderNumberOfLastVideo;

    $: filteredCoursesList = coursesList?.filter((item) => item?.id != courseUuid);

    $:dataToSend = {
		url: video?.url,
		orderNumber: orderNumberOfLastVideo+1,
		languageCode: video?.languageCode 
	};

    // Reset selections and errors
    function resetSelections() {
        selectedCourse = null;
        selectedCourseUuid = null;
        selectedChapter = null;
        selectedChapterUuid = null;
        chaptersList = [];
        validationErrors = {};
    }

	function handleOutsideClick() {
		// Prevents any action when clicking outside the modal
		return;
	}

    function handleCancel() {
        dispatch('handleCancelSubmission');
        resetSelections();
    }

    function handleCancelSelectionInChapterDropDown(){
        selectedChapter = null;
            selectedChapterUuid = null;
            validationErrors={}

    }

    function handleCancelSelectionInCourseDropDown(e){
        resetSelections();
    }

    function handleErrorMessageClose(){
		errorMessage=''
	}

    // Fetch chapters when a course is selected
    $: if (selectedCourseUuid) {
        selectedChapter = null;
        selectedChapterUuid = null;
        validationErrors={}
        fetchChapters(selectedCourseUuid);
    }

    $:updateVideosDataInAscendingOrder(selectedChapterUuid)
	function updateVideosDataInAscendingOrder(){
		if(!selectedChapterUuid) return
		selectedChapterVideos = chaptersList?.find(
            (item) => item?.id === selectedChapterUuid
		)?.videos || [];
        let videosDataInAscendingOrder = [...selectedChapterVideos]
    // Sort the array in ascending order based on orderNumber
    videosDataInAscendingOrder.sort((a, b) => Number(a.orderNumber) - Number(b.orderNumber));

    findOrderNUmberOfLastVideo();
	}

	function findOrderNUmberOfLastVideo(){
		orderNumberOfLastVideo=selectedChapterVideos[selectedChapterVideos?.length-1]?.orderNumber || 0
		dataToSend.orderNumber=orderNumberOfLastVideo +1
	}


    async function fetchChapters(courseUuid) {
        try {
            const course = filteredCoursesList.find((c) => c.uuid === courseUuid);
			errorMessage = '';
			isSubmitting = true;
			const response = await fetch(
				`/apis/courses/details/${selectedCourseUuid}`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				}
			);
			if (!response.ok) {
				errorMessage = `Failed to fetch chapters of the course. Please try again!`;
				throw new Error('Failed to fetch hapters of the course');
			}
			const result = await response.json();
			if (!result.error) {
            const chapters = result?.chapters || [];
            chaptersList = chapters?.map((chapter) => {
                const englishTranslation = chapter.translations.find(
                    (translation) => translation.languageCode === "en"
                );
                return {
                    id: chapter.uuid,
                    title: englishTranslation ? englishTranslation.title : "No English Title",
                    videos:chapter?.videos
                };
            });
            if(chaptersList?.length===0){
                errorMessage = `This course doesnt have any chapters added.`;
            }
        } else {
            errorMessage = `Failed to fetch chapters of the course. Please try again.`;
        }
		} catch (error) {
			console.error('Error:', error);
		} finally {
			isSubmitting = false;
		}

    }


    async function handleSubmit() {
        let result=null;
		let resultOfApiCall=null

		try {
			failedAPICall=false
			errorMessage = '';
			isSubmitting = true;
			validationErrors = {};

            
            if (selectedCourse===null) {
				validationErrors = { ...validationErrors, selectedCourse: `This field should not be empty.` };
			    isSubmitting = false;
				await tick();
				return;
			}

           
			
			if (selectedChapter===null) {
                validationErrors = { ...validationErrors, selectedChapter: `This field should not be empty.` };
			    isSubmitting = false;
				await tick();
				return;
			}

             // Validate if the URL already exists
			const duplicate = chaptersList?.some((chapter) => 
                chapter?.videos?.some((video) => video?.url === dataToSend?.url)
            );
			 
             if (duplicate) {
                 errorMessage = `Failed to add video. Video already exists in the chapter.`;
			    isSubmitting = false;
                 return;
             }
			const response = await fetch(
				`/apis/courses/details/${selectedCourseUuid}/chapters/${selectedChapterUuid}/videos?courseUuid=${selectedCourseUuid}&&chapterUuid=${selectedChapterUuid}&&videoUuid=${videoUuid}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(dataToSend)
				}
			);
			if (!response.ok) {
				errorMessage = `Failed to move video. Please try again!`;
				throw new Error('Failed to move video');
			}

			resultOfApiCall = await response.json();
			
			if (!resultOfApiCall.error) {
				result = resultOfApiCall.responseData
                if(resultOfApiCall?.status == 201){
                    handleDeleteVideoFromCurrentChapter()
                }
				
				return
			} else {
                if(resultOfApiCall?.status === 409){
                    errorMessage = `Failed to move video. Video already exists in the chapter.`;
                } else{
                    errorMessage = `Failed to move video. Please try again.`;
                }
			}
		} catch (error) {
			console.error('Error:', error);
		} finally {
			if (!resultOfApiCall?.error) return
			isSubmitting = false;
			if (!errorMessage && !validationErrors) {
				handleCancel();
			}
		}
	}

	async function handleDeleteVideoFromCurrentChapter() {
		try {
			errorMessage = '';
			isSubmitting = true;
			validationErrors = '';
			if (!selectedChapter) {
				 validationErrors = { ...validationErrors, selectedChapter: `This field should not be empty.` };
                await tick()
				return;
			}
			const response = await fetch(
				`/apis/courses/details/${chapterData?.courseUuid}/chapters/${chapterData?.uuid}/videos/${videoUuid}?courseUuid=${chapterData?.courseUuid}&&chapterUuid=${chapterData?.uuid}&&videoUuid=${videoUuid}`,
				{
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(dataToSend)
				}
			);

			if (!response.ok) {
				errorMessage = `Successully added video to ${selectedChapter} but failed to delete from ${currentChapterName}. Please delete the video from ${currentChapterName}`;
				failedAPICall=true
				throw new Error('Failed to move video');
			}
			const result = await response.json();
			if (!result.error) {
				dispatch('handleVideoDeletionInVideoMoveFunctionality', videoUuid);
			} else {
				errorMessage = `Successully added video to ${selectedChapter} but failed to delete from ${currentChapterName}. Please delete the video from ${currentChapterName}`;
				throw new Error('Failed to move video');
			}
		} catch (error) {
			console.error('Error:', error);
		} finally {
			isSubmitting = false;
			if (!errorMessage && !validationErrors) {
				handleCancel();
			}
		}
	}

	onMount(() => {
		// Disable scrolling on the main page
		document.body.style.overflow = "hidden";
	});

	onDestroy(() => {
		// Re-enable scrolling when the modal is closed
		document.body.style.overflow = "";
	});

</script>

<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
	on:click|stopPropagation={handleOutsideClick}></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto" id="form">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div class="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
			
			>
				<div class="pb-2">
					{#if isSubmitting}
					<LineLoader />
					{/if}
				</div>
                {#if errorMessage}
                <div class="mb-4">
                    <DeletionErrorMessage {errorMessage}
                    on:handleErrorMessageClose={handleErrorMessageClose} />
                </div>
                {/if}
                <h2 class="capitalize font-semibold">
                    Move - <span>"{videoTitle}"</span>
                </h2>
                <div class="mb-4">
                    <p>Current Course: {courseTitle}</p>
                </div>

                <div class="mb-1">
                    <p>Move "{videoTitle}" to:</p>
                </div>

                <div class="flex flex-col gap-3 text-sm">
                    <div class="flex gap-1 items-center">
                        <span class="whitespace-nowrap">Course:</span>
                        <div class="flex-grow">
                            <SearchableComboBox
                            options={filteredCoursesList}
                            filterCategory={'courseListing'}
                            placeholder={'Select a Course'}
                            validationErrors={validationErrors.selectedCourse || ''}
                            bind:selectedItemName={selectedCourse}
                            bind:selectedItemId={selectedCourseUuid}
                            on:handleDispatchFilterData={handleCancelSelectionInCourseDropDown}
                        />
                        </div>
                    </div>

                    {#if selectedCourse && chaptersList?.length>0}
                        <div class="flex gap-1 items-center">
                            <span class="whitespace-nowrap">Chapter:</span>
                            <div class="flex-grow">
                                <DropDown
                                    on:handleCancelSelection={handleCancelSelectionInChapterDropDown}
                                    bind:selectedItemName={selectedChapter}
                                    bind:selectedItemUuid={selectedChapterUuid}
                                    options={chaptersList}
                                    validationErrors={validationErrors.selectedChapter || ''}
                                    type="chapterList"
                                    placeholder={'Select chapter'}
								    disabled={chaptersList?.length===0 || failedAPICall==true}
                                    

                                />
                            </div>
                        </div>
                    {/if}
                </div>

                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
						disabled={failedAPICall || isSubmitting ||errorMessage}
                        on:click={handleSubmit}
                    >
                        Move
                    </button>
                    <button
                        type="button"
                        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
						disabled={ isSubmitting}
                        on:click={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
