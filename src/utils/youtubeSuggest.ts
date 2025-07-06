type SuggestionData = [string, string[], object]

export async function youtubeSuggest(query: string) {
    const res = await fetch(`http://suggestqueries.google.com/complete/search?client=firefox&ds=yt&gl=kr&q=${query}`);
    const data = (await res.json()) as SuggestionData;
    return data[1];
}