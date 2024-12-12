export async function load({ fetch, url }) {
	const fetchTestimonialDetails = async () => {
		const testimonial = url.searchParams.get('data');
		const testimonialData = JSON.parse(decodeURIComponent(testimonial));
		let id = testimonialData?.uuid;
		try {
			const res = await fetch(`/apis/traineeTestimonials/${id}`);
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
