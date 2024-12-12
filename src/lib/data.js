export const durationInterval = [
	{
		id: 1,
		name: 'Days'
	},
	{
		id: 2,
		name: 'Weeks'
	},
	{
		id: 3,
		name: 'Months'
	}
];

export const courseCategory = [
	{
		id: 1,
		name: 'Agricultural EDPs'
	},
	{
		id: 2,
		name: 'Process EDPs'
	},
	{
		id: 3,
		name: 'Product EDPs'
	},
	{
		id: 4,
		name: 'General EDPs'
	}
];

export const faqCategory = [
	{ id: 1, name: 'Programme Overview' },
	{ id: 2, name: 'Eligibility' },
	{ id: 3, name: 'Accreditation and Approvals' },
	{ id: 4, name: 'Infrastructure and Facilities' },
	{ id: 5, name: 'Post-Training Support' },
	{ id: 6, name: 'Financial Assistance' },
	{ id: 7, name: 'Impact and Success Stories' }
];

export const distList = [
	{
		extId: 2,
		name: 'Anantapur',
		languageCode: 'en'
	},
	{
		extId: 1,
		name: 'Chittoor',
		languageCode: 'en'
	},
	{
		extId: 3,
		name: 'Guntur',
		languageCode: 'en'
	},
	{
		extId: 2,
		name: 'अनंतपुर',
		languageCode: 'hi'
	},
	{
		extId: 1,
		name: 'चित्तूर',
		languageCode: 'hi'
	},
	{
		extId: 3,
		name: 'गुंटूर',
		languageCode: 'hi'
	}
];
export let courseStats = [
	{
		label: 'Total views',
		valueNumber: '23.45',
		valueText: 'lakh',
		trend: '↑ 5.39% from last week'
	},
	{
		label: 'Total watch time ',
		valueNumber: '29.45',
		valueText: 'hrs',
		trend: '↑ 11.25% from last week'
	},
	{
		label: 'Total Trainees',
		valueNumber: '30.45',
		valueText: 'lakh',
		trend: '↑ 5.39% from last week'
	}
];

export let tcStats = [
	{
		label: 'Total RSTEIs',
		valueNumber: '85',
		trend: '↑ 5.39% from last week'
	},

	{
		label: 'Active RSTEIs',
		valueNumber: '68',
		trend: '↑ 11.25% from last week'
	},
	{
		label: 'State/UTs',
		valueNumber: '25',
		trend: '↑ 5.39% from last week'
	},
	{
		label: 'Funding groups',
		valueNumber: '36',
		trend: '↑ 5.39% from last week'
	}
];

export let tcStatsDetails = [
	{
		label: 'Trainees',
		valueNumber: '85',
		trend: '↑ 5.39% from last week'
	},

	{
		label: 'Trainers',
		valueNumber: '13',
		trend: '↑ 11.25% from last week'
	},
	{
		label: 'Video views',
		valueNumber: '2,145',
		trend: '↑ 5.39% from last week'
	},
	{
		label: 'Watch time(hrs)',
		valueNumber: '456',
		trend: '↑ 11.25% from last week'
	}
];

export let narDetails = {
	name: 'lorem National Academy of RUDSETI',
	address: 'lorem Dariya Ganj, MayurGanj, Patna, Bihar,435789',
	phoneNumber: 'lorem 7302233451,8547233451',
	email: 'loremabcnar@gmail.com, abcnar@gmail.com'
};

export let syllabusData = [
	{
		id: 1,
		moduleName: 'lorem Introduction Fabric Types and Textures',
		moduleData: [
			{ topic: 'Fabric Types from North India', content: 'abcd', duration: '10' },
			{ topic: 'Fabric Types from South India', content: 'efgh', duration: '15' }
		]
	},
	{
		id: 2,
		moduleName: 'lorem Introduction to Fabric Textures',
		moduleData: [
			{ topic: 'Fabric Types from East India', content: 'abcd', duration: '10' },
			{ topic: 'Fabric Types from South India', content: 'efgh', duration: '15' }
		]
	}
];

export let chapterList = [
	{
		id: 1,
		title: 'Chapter 1'
	},
	{
		id: 2,
		title: 'Chapter 2'
	},
	{
		id: 3,
		title: 'Chapter 3'
	}
];

export let courseData = {
	uuid: '445d6748-8a63-49ef-912b-5f03e967b86e',
	courseCode: 'NARQ40010',
	duration: 120,
	name: 'Introduction to Java',
	numberOfChapters: 3,
	numberOfVideos: 1,
	imageUrl: 'https://example.com/course-images/prog101.jpg',
	translations: [
		{
			id: 29,
			title: 'Introducción a la Programación',
			description:
				'Aprende los fundamentos de la programación con este curso completo para principiantes.',
			aboutVideoUrl: 'https://example.com/course-videos/prog101-intro-es.mp4',
			languageCode: 'hi'
		},
		{
			id: 28,
			title: 'Introduction to Programming',
			description: 'Learn the basics of programming with this comprehensive course for beginners.',
			aboutVideoUrl: 'https://example.com/course-videos/prog101-intro-en.mp4',
			languageCode: 'en'
		}
	],
	chapters: [
		{
			uuid: '52a3b58c-493e-4346-9c5d-45ebcd37a2e0',
			orderNumber: 3,
			translations: [
				{
					id: 6,
					title: 'Control de Flujo en Svelte',
					description: 'Aprende sobre las declaraciones if-else, bucles y casos switch en Svelte.',
					languageCode: 'hi'
				},
				{
					id: 5,
					title: 'Control Flow in Svelte',
					description: 'Learn about if-else statements, loops, and switch cases in Svelte.',
					languageCode: 'en'
				}
			],
			videos: [
				{
					uuid: 'abb48163-4556-41ab-92c9-1acd34629880',
					name: 'Introduction to Java',
					description: 'Learn the basics of Java programming language',
					thumbnail: 'https://example.com/thumbnails/intro-to-java.jpg',
					duration: null,
					extId: null,
					url: 'https://www.youtube.com/watch?v=lhLDbUZ292E',
					languageCode: 'en',
					status: 'ACTIVE'
				},
				{
					uuid: 'dbc650ea-d44f-4f55-93c1-fc4999c23ccc',
					extId: 'gcc-81e057a8-531b-4bc8-aef0-4b591db6f6b6',
					url: 'https://youtu.be/sSg1Lbfp798?si=YUPizuuQ3pKvvVwo',
					name: ' Beautiful bridal Hairstyle',
					description:
						'Most Beautiful bridal Hairstyle for weddings_Easy Graceful Hairstyle tutorial for girls ',
					thumbnail: null,
					author: 'Nirmala Hairstyles',
					duration: 120,
					status: 'ACTIVE',
					languageCode: 'hi'
				},
				{
					uuid: 'd96da2b8-f601-4bee-be45-49888d1acefd',
					extId: 'gcc-40b23a72-13d5-4962-827d-85115b21185f',
					url: 'https://youtu.be/h8SbaEkh1Fg?si=AAZQjILcValkvvfq',
					name: ' Back braid hairstyle in 15 minutes',
					description:
						'simple back braid hairstyle in 15 minutes/ easy messy braid hairstyle /hairstyle for mehndi function ',
					thumbnail: null,
					author: 'Nirmala Hairstyles',
					duration: 120,
					status: 'ACTIVE',
					languageCode: 'en'
				},
				{
					uuid: '0319b26c-c9d0-41cf-a597-2c264beb3dde',
					extId: 'gcc-401aa865-d547-491b-8e8e-88126cc611f1',
					url: 'https://youtu.be/pjpKMQS6hG8?si=DPcdajBiKbTwDXcL',
					name: 'Introduction Video on hair cut',
					description: 'This is a introduction Video on hair cut.',
					thumbnail: null,
					author: 'Author Name',
					duration: 120,
					status: 'ACTIVE',
					languageCode: 'en'
				}
			],
			courseUuid: '445d6748-8a63-49ef-912b-5f03e967b86e',
			numberOfVideos: 4
		},
		{
			uuid: 'e129636f-6c13-4790-8eb2-2f8518fefe89',
			orderNumber: 2,
			translations: [
				{
					id: 4,
					title: 'Control Flow in C++',
					description: 'Learn about if-else statements, loops, and switch cases in Java.',
					languageCode: 'en'
				},
				{
					id: 3,
					title: 'Control de Flujo en C++',
					description: 'Aprende sobre las declaraciones if-else, bucles y casos switch en Java.',
					languageCode: 'hi'
				}
			],
			videos: [
				{
					uuid: 'ac7b9364-c290-41e6-b540-f5a19e9de605',
					extId: 'gcc-47f0a820-b0e5-4969-9efb-e71519aa188e',
					url: 'https://www.youtube.com/watch?v=f0NqkqpxWMM',
					name: 'unique & trendy hairstyle for engagement bride look',
					description:
						'Hair Dummy - https://amzn.to/3CHH9AK\nDummy Stand - https://amzn.to/30iE36a\nHairstyle Tools - https://amzn.to/3m5NIUE\n\nFollow On Facebook - https://www.facebook.com/KhushbuMakeup/\nFollow On Instagram - https://www.instagram.com/khushbustyle/\n\nHi, Guys Welcome To Best hairstyle Channel Khushbu Style. Hope You guys are liking my daily update of hairstyles for girls. We are specialised in Every kind of hairstyles like, simple hairstyle, natural hair styles, braid hairstyles, short hairstyles, hair style girl, cute hairstyles, kids hairstyle, curly hairstyles, medium hairstyles, prom hairstyles, long hairstyles, easy hairstyles, medium length hairstyles, hairstyles for short hair, hairstyles for long hair, short hairstyles for women, new hairstyle, ponytail,  puff, ponytail hairstyles, juda hairstyle, chignon hairstyle, hair bun, bun hairstyles etc. \n\nI always try to make latest hairstyle and new hairstyle and hairstyle for beginners..\n\n**** Thanks For Watching My hairstyle Video ****',
					thumbnail: null,
					author: 'null',
					topic: 'Trending hair',
					duration: 610,
					extPayload: null,
					watchType: null,
					status: 'ACTIVE',
					module: 'Hair',
					views: null,
					languageCode: 'en',
					courseCode: null,
					moduleCode: null,
					videoLength: 0
				},
				{
					uuid: 'da53a3cf-a9e5-4dee-89c9-597ac5d9c1a4',
					extId: 'gcc-e602a82f-bd69-48d5-9df9-98fa897c0190',
					url: 'https://www.youtube.com/watch?v=YDXPwYHuK88',
					name: 'Bridal hairstyle// long hairstyle//#subscribe #like #share #comment',
					description:
						'Hello everyone â¤ï¸\n\nPlease subscribe, like, share and comment to my channel and thank you for watching \n\nHave a nice day ð\n\n#bridalhairstyle #longhair #weddinghairstyles #easyhairstyle',
					thumbnail: null,
					author: 'null',
					topic: 'Bridal hair',
					duration: 473,
					extPayload: null,
					watchType: null,
					status: 'ACTIVE',
					module: 'Hair',
					views: null,
					languageCode: 'en',
					courseCode: null,
					moduleCode: null,
					videoLength: 0
				}
			],
			courseUuid: '445d6748-8a63-49ef-912b-5f03e967b86e',
			numberOfVideos: 0
		},
		{
			uuid: 'c0fd8218-b1be-46ec-9e88-86a1f34d232b',
			orderNumber: 1,
			translations: [
				{
					id: 1,
					title: 'Control de Flujo en Java',
					description: 'Aprende sobre las declaraciones if-else, bucles y casos switch en Java.',
					languageCode: 'hi'
				},
				{
					id: 2,
					title: 'Control Flow in Java',
					description: 'Learn about if-else statements, loops, and switch cases in Java.',
					languageCode: 'en'
				}
			],
			videos: [],
			courseUuid: '445d6748-8a63-49ef-912b-5f03e967b86e',
			numberOfVideos: 0
		}
	]
};
