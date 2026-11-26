/** Copies text to the clipboard; resolves to false when the browser refuses (e.g. insecure context). */
export async function copyText(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
}
