<script>
    import { page } from '$app/stores';
	import AddCourseForm from "$lib/courses/addCourse/AddCourseForm.svelte";
	import { onMount } from 'svelte';
	import {getCategoryName} from '$lib/utils/helper.js'

	
	export let data

let formObject = {};
let dataFromUrl = $page.url.searchParams.get('data'); 
let parsedData = dataFromUrl ? JSON.parse(dataFromUrl) : {};
let courseUuid = parsedData?.uuid
let error = '';

async function fetchCourseData(uuid) {
    try {
        const response = await fetch(`/apis/courses/details/${uuid}`);
        if (!response.ok) throw new Error('Failed to fetch course data');

        const courseData = await response.json(); // Assuming response is an array
        populateFormObject(courseData);
    } catch (err) {
        console.error('Error fetching course data:', err);
        error = 'Could not load course data. Please try again later.';
    }
}

// Populate formObject with data for both languages
function populateFormObject(courseData) {
    const enTranslation = courseData.translations.find(t => t.languageCode.toLowerCase() === 'en');
    const hiTranslation = courseData.translations.find(t => t.languageCode.toLowerCase() === 'hi');
    let categoryName=''
    if(courseData?.category){
        categoryName=getCategoryName(courseData?.category)??''
    }

    formObject = {
        // Common fields
        uuid: courseData?.uuid,
        courseCode: courseData?.courseCode,
        duration: courseData?.duration,
        category: courseData?.category,
        categoryName:categoryName,
        image: courseData?.imageUrl,

        // English translation
        titleEn: enTranslation?.title || '',
        descriptionEn: enTranslation?.description || '',
        urlEn: enTranslation?.aboutVideoUrl || '',

        // Hindi translation
        titleHi: hiTranslation?.title || '',
        descriptionHi: hiTranslation?.description || '',
        urlHi: hiTranslation?.aboutVideoUrl || '',

        method: 'PUT', 
    };
}

// Fetch course data when the component mounts
onMount(() => {
    if (courseUuid) {
        fetchCourseData(courseUuid);
    } else {
        error = 'No course UUID provided';
    }
});
</script>

<AddCourseForm route={$page.route.id} params={$page.params} {formObject}  />