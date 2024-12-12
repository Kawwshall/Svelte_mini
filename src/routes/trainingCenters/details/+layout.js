import { String_Constants } from '/src/config/constants.js';

export async function load({ fetch, url }) {
	const fetchDetailsOfTc = async () => {
		const tcDetails = url.searchParams.get('data');
		let tcObj = JSON.parse(decodeURIComponent(tcDetails));
		let id = tcObj?.uuid;


		try {
			const res = await fetch(`/apis/trainingCenters/details/${id}`);
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

	const courseDetailsofTC = async () => {
		const tcDetails = url.searchParams.get('data');

		let tcObj = JSON.parse(decodeURIComponent(tcDetails));
		let id = tcObj?.uuid;

		try {
			const res = await fetch(`/apis/trainingCenters/courses/${id}`);

			if (!res.ok || res.status !== 200) {
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

	const coursesListing = async () => {
		try {
			const res = await fetch(`/apis/courses`);
			if (!res.ok) {
				throw new Error('Data not found');
			}
			if (res.status !== 200) {
				throw new Error('Data not found');
			}
			let data = await res.json();
			if (data?.length === 0 || Object.keys(data)?.length === 0) {
				return [
					{
						title: 'No State Found'
					}
				];
			}
	
			// create a map and then pass it for easier extraction of data
			let dataMap = {};
			data.forEach((course) => {
				dataMap[course.courseCode] = {
					uuid: course.uuid,
					courseCode: course.courseCode,
					duration: course.duration,
					category: course.category,
					status: course.status,
					numberOfChapters: course.numberOfChapters,
					numberOfVideos: course.numberOfVideos,
					...course.translations.find((translation)=> translation.languageCode === 'en')
				};
			});
			return dataMap;
		} catch (err) {
			return { error: err.message };
		}
	};

	return {
		tcDetailsData: await fetchDetailsOfTc(),
		tcCourseDetailsData: await courseDetailsofTC(),
		courseList: await coursesListing()
	};
}
