<script>
	import UserDetailsPreview from "$lib/users/UserDetailsPreview.svelte";
    import { page } from "$app/stores";

</script>

<UserDetailsPreview route ={ $page.route.id} params ={$page.params} />