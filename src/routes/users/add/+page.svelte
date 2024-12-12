<script>
    import { page } from '$app/stores';
	import AddUserForm from '$lib/users/addUser/AddUserForm.svelte';
    let route = $page.route.id;
	let params = $page.params;
    let userData ={}
    export let form
    export let data
    function handleUserdata(event){
        userData = event.details
    }


</script>

<AddUserForm {route} {params} on:userData={handleUserdata} {form} stateOptionList={data?.stateData}/>
