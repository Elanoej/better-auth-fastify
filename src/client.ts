import { auth } from "./lib/auth";

const main = async () => {
	const _credentials = {
		email: "elanomarcena@gmail.com",
		password: "elano123",
	};

	// const response = await auth.api.signUpEmail({
	// 	body: {
	// 		email: "elanomarcena@gmail.com",
	// 		password: "elano123",
	// 		name: "Elano Marcena",
	// 	},
	// 	asResponse: true,
	// });

	const response = await auth.api.sendVerificationEmail({
		body: {
			email: "elanomarcena@gmail.como",
		},
    asResponse: true,
	});


	// const response = await auth.api.signInEmail({
	// 	body: {
	// 		...credentials,
	// 	},
	// 	asResponse: true,
	// });

	console.log(await response.json());
};

main();
