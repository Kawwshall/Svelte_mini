<script>
	import { page } from '$app/stores';
	import BulkUpload from '$lib/components/BulkUpload.svelte';
</script>

<div>
	<BulkUpload
		bulkUploadItemName="chapters"
		endPoint={`/courses/details/${$page.params.id}/chapters/bulkUpload`}
	/>
</div>
