export function changePathVisibility(path: string, hide: boolean) {
	const escapedPath = CSS.escape(path);
	const n = document.querySelector(`[data-path="${escapedPath}"]`);
	if (!n) {
		return;
	}
	const p = n.parentElement
    if (!p) return;
	if (hide) {
		p.style.display = `none`
	} else {
		p.style.display = ``;
	}
}

function toVisiblePath(path: string, ext: string): string {
	return path.endsWith("." + ext) ? path.slice(0, -(ext.length + 1)) + ".md" : path;
}

/**
 * Returns where a hiddenList entry ends up after the vault renamed oldPath to newPath.
 * Entries are always kept in their visible (.md) form, so hiding stays idempotent.
 */
export function remapHiddenPath(entry: string, oldPath: string, newPath: string, ext: string): string {
	//The plugin swaps .md <-> .pp itself, that is not a move.
	if (toVisiblePath(oldPath, ext) === toVisiblePath(newPath, ext)) return entry;

	const isFileEntry = entry.endsWith(".md");
	const hiddenEntry = isFileEntry ? entry.slice(0, -3) + "." + ext : entry;

	//The entry itself moved, either while visible or while hidden.
	if (oldPath === entry || oldPath === hiddenEntry) {
		return isFileEntry ? toVisiblePath(newPath, ext) : newPath;
	}

	//A parent folder of the entry moved.
	if (entry.startsWith(oldPath + "/")) return newPath + entry.slice(oldPath.length);

	return entry;
}
