<script>
    import { goto } from '$app/navigation';
    import Datatable from '$lib/components/DataTable.svelte';
    import ErrorMessage from '$lib/components/ErrorMessage.svelte';
    import GoogleMatrialIcon from './GoogleMatrialIcon.svelte';
  
    export let videoObject = {};
    export let error = null;
    export let loading = false;
  
    $: courses = videoObject.courses || [];
    $: chapters = videoObject.chapters || [];
  
    function getChaptersForCourse(courseUuid) {
      return chapters.filter(chapter => chapter.courseUuid === courseUuid);
    }
  
    function formatTableData() {
      return courses.flatMap(course => {
        const courseChapters = getChaptersForCourse(course.uuid);
        if (courseChapters.length === 0) {
          return [{
            courseName: course.translations.find(t => t.languageCode === 'en')?.title || course.courseCode,
            chapterName: '-',
            courseUuid: course.uuid,
            chapterUuid: null,
          }];
        }
        return courseChapters.map(chapter => ({
          courseName: course.translations.find(t => t.languageCode === 'en')?.title || course.courseCode,
          chapterName: chapter.translations.find(t => t.languageCode === 'en')?.title || `Chapter ${chapter.orderNumber}`,
          courseUuid: course.uuid,
          chapterUuid: chapter.uuid
        }));
      });
    }
  
    $: tableData = formatTableData();
  
    let tableHeaderDisplay = [
      { key: 'courseName', name: 'Course' },
      { key: 'chapterName', name: 'Chapter' },
    ];
  
    function handleViewClick(courseUuid, chapterUuid) {
      const hash = chapterUuid ? `#chapter-${chapterUuid}` : '';
      const dataToSend = JSON.stringify({ uuid:courseUuid });
      goto(`/courses/details?course=${encodeURIComponent(dataToSend)}`);
    }
  
    function handleTableAction(event) {
      const { actionName, actionData } = event.detail;
      if (actionName === 'view') {
        handleViewClick(actionData.courseUuid, actionData.chapterUuid);
      }
    }
  </script>
  
  {#if tableData.length !== 0 && !error}
    <div class="bg-white p-4 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">Courses and Chapters</h2>
      <Datatable
        on:tableActionClick={handleTableAction}
        {tableData}
        tableHeadersDisplay={tableHeaderDisplay}
        actionConfigObject={[
          {
            actionName: 'view',
            actionIconName: 'visibility',
            goto: '',
            modal: false
          }
        ]}
        rowHeight={'compact'}
      >
        <svelte:fragment slot="row" let:data>
          <td class="whitespace-nowrap pl-4 pr-3 py-2 text-sm font-base text-darkGray">
            {data.courseName}
          </td>
          <td class="whitespace-nowrap pl-4 pr-3 py-2 text-sm font-base text-darkGray">
            {data.chapterName}
          </td>
          <td class="relative whitespace-nowrap px-4 py-2 text-sm font-medium">
            <button
              on:click={() => handleViewClick(data.courseUuid, data.chapterUuid)}
              class="text-orange-100 hover:text-indigo-900 relative"
            >
              <GoogleMatrialIcon iconName="visibility" />
              <span class="sr-only">View</span>
            </button>
          </td>
        </svelte:fragment>
      </Datatable>
    </div>
  {:else}
    <div class="bg-white p-4 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">Courses and Chapters</h2>
      <ErrorMessage error={error || 'No courses or chapters found for this video'} />
    </div>
  {/if}