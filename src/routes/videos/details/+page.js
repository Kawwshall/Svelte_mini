export async function load({ fetch, url }) {
	const fetchVideoDetails = async () => {
	const id =  url.searchParams.get('uuid');
		try {
			const res = await fetch(`/apis/videos/details/${id}`);
			if (!res.ok) {
				throw new Error('Data not found');
			}
            if(res.status!==200){
				throw new Error('Data not found')
			}
			let data = await res.json();
			if (data?.length===0 || Object.keys(data)?.length===0) {
				throw new Error('Data not found');
			}
			return data;
		} catch (err) {
			return { error: err.message };
		}
	};

	return {
		videoDetails: await fetchVideoDetails()
	};
}
