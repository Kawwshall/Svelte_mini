export async function load({ fetch, url }) {
	const fetchDetailsOfACourse = async () => {
		const course = url.searchParams.get('data');
		let courseObj = JSON.parse(decodeURIComponent(course));
		let id = courseObj?.uuid;
		let res;
		try {
			res = await fetch(`/apis/courses/details/${id}`);
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

	const fetchVideosOfACourse = async () => {
		const course = url.searchParams.get('data');
		let courseObj = JSON.parse(decodeURIComponent(course));
		let id = courseObj.uuid;

		try {
			const res = await fetch(`/apis/courses/details/videos/${id}`);
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
			return [];
		}
	};

	return {
		courseDetailsData: await fetchDetailsOfACourse(),
		videosData: await fetchVideosOfACourse()
	};
}
