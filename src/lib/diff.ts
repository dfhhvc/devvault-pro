/**
 * Text diff utility using LCS (Longest Common Subsequence) algorithm.
 * Produces line-by-line diff output.
 */

export interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  oldLine?: number;
  newLine?: number;
}

/**
 * Compute the LCS table for two arrays of strings.
 */
function lcsTable(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp;
}

/**
 * Backtrack through the LCS table to produce a diff.
 */
function backtrack(
  dp: number[][],
  a: string[],
  b: string[],
  i: number,
  j: number
): DiffLine[] {
  const result: DiffLine[] = [];
  let oldLine = i;
  let newLine = j;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      result.unshift({
        type: "unchanged",
        content: a[i - 1],
        oldLine: i,
        newLine: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({
        type: "added",
        content: b[j - 1],
        newLine: j,
      });
      j--;
    } else if (i > 0) {
      result.unshift({
        type: "removed",
        content: a[i - 1],
        oldLine: i,
      });
      i--;
    }
  }

  return result;
}

/**
 * Compute a line-by-line diff between two text strings.
 * Uses the LCS algorithm for optimal diff.
 */
export function diffText(oldText: string, newText: string): DiffLine[] {
  const a = oldText.split("\n");
  const b = newText.split("\n");
  const dp = lcsTable(a, b);
  return backtrack(dp, a, b, a.length, b.length);
}

/**
 * Generate a unified diff-style string.
 */
export function formatUnifiedDiff(oldText: string, newText: string): string {
  const lines = diffText(oldText, newText);
  return lines
    .map((line) => {
      const prefix =
        line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";
      return `${prefix} ${line.content}`;
    })
    .join("\n");
}

/**
 * Compute diff statistics.
 */
export function diffStats(oldText: string, newText: string): {
  additions: number;
  deletions: number;
  unchanged: number;
} {
  const lines = diffText(oldText, newText);
  return {
    additions: lines.filter((l) => l.type === "added").length,
    deletions: lines.filter((l) => l.type === "removed").length,
    unchanged: lines.filter((l) => l.type === "unchanged").length,
  };
}
