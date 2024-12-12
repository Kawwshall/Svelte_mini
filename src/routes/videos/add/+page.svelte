<script>
	import { page } from '$app/stores';
    import AddVideoForm from '$lib/videos/addVideo/AddVideoForm.svelte';

    export let data;
    
    let courseCodeFromParams=$page.url.searchParams.get('data')
    let formObject={
		courseCode:courseCodeFromParams?courseCodeFromParams:'' ,
		title: '',
		topic: '',
		chapter:'',
		uuid: '',
		videoURL:'',
	}

    let courseCodeList=[]

    data?.coursesData?.forEach((course,index)=>{

        if(course?.courseCode){
        courseCodeList.push({
            id:index,
            title:course?.courseCode
        })
        }
        courseCodeList=courseCodeList
    }
)
	
</script>

<AddVideoForm route={$page.route.id} params={$page.params} {courseCodeList} {formObject} />