<script>
    import { page } from '$app/stores';
	import AddCourseForm from "$lib/courses/addCourse/AddCourseForm.svelte";
	import AddVideoForm from "$lib/videos/addVideo/AddVideoForm.svelte";

	export let data

    let formObject=[]
    let formDataFromQueryParams=$page.url.searchParams.get('data')
    
    if(formDataFromQueryParams){
        let parsedFormDataFromQueryParams=JSON.parse(formDataFromQueryParams)
		formObject=parsedFormDataFromQueryParams
	
	}
</script>

<AddVideoForm route={$page.route.id} params={$page.params} {formObject} />