export async function load({ fetch }) {
	const fetchTestimonials = async () => {
		try {
			const res = await fetch(`/apis/traineeTestimonials`);
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

    const fetchCourseListDetails = async () => {

		let res;
		try {
			res = await fetch(`/apis/courses`);
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
			return { status: res.status, error: err.message };
		}
	};


	return {
		testimonials: await fetchTestimonials(),
        coursesData: await fetchCourseListDetails()
	};
}
