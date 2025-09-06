const API_URL = "/api/graphql";

type GraphQLResponse<T> = {
	data?: T;
	errors?: Array<{ message: string }>;
};

export async function gqlFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
	const res = await fetch(API_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ query, variables }),
	});
	const json = (await res.json()) as GraphQLResponse<T>;
	if (json.errors && json.errors.length) {
		throw new Error(json.errors.map((e) => e.message).join(", "));
	}
	return json.data as T;
}

