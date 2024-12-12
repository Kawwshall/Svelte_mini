export async function load({ fetch, params, url }) {
	const dataParam = url.searchParams.get('data');
	let uuid = '';
	if (dataParam) {
		const dataObject = JSON.parse(decodeURIComponent(dataParam));
		uuid = dataObject.uuid;
	}
	const fetchTestimonialDetails = async () => {
		try {
			const res = await fetch(`/apis/officialTestimonials/${uuid}`);
			if (!res.ok) {
				throw new Error('Data not found');
			}
			if (res.status !== 200) {
				throw new Error('Data not found');
			}
			const data = await res.json();
			if (data?.length === 0 || Object.keys(data)?.length === 0) {
				throw new Error('Data not found');
			}
			return data;
		} catch (err) {
			return { error: err.message };
		}
	};

	return {
		testimonialDetails: await fetchTestimonialDetails()
	};
}
