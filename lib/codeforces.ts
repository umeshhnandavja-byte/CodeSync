export interface CodeforcesUserStats {
    handle: string;
    rating: number;
    maxRating: number;
    rank: string;
    maxRank: string;
    avatar: string;
    totalSolved: number;
  }
  
  export async function getCodeforcesUserStats(handle: string): Promise<CodeforcesUserStats> {
    const cleanHandle = handle.trim();
    const url = `https://codeforces.com/api/user.info?handles=${cleanHandle}`;
    const statusUrl = `https://codeforces.com/api/user.status?handle=${cleanHandle}`;
    
    try {
      // Fetch user info and submissions concurrently
      const [infoRes, statusRes] = await Promise.all([
        fetch(url, { cache: "no-store" }),
        fetch(statusUrl, { cache: "no-store" })
      ]);
  
      if (!infoRes.ok) {
        throw new Error("Failed to fetch from Codeforces API");
      }
  
      const infoData = await infoRes.json();
      if (infoData.status !== "OK" || !infoData.result || infoData.result.length === 0) {
        throw new Error(`Codeforces user '${cleanHandle}' not found`);
      }
  
      const user = infoData.result[0];
  
      // Calculate unique solved problems from submissions
      let totalSolved = 0;
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        if (statusData.status === "OK" && Array.isArray(statusData.result)) {
          const solvedSet = new Set<string>();
          statusData.result.forEach((sub: any) => {
            if (sub.verdict === "OK") {
              solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
            }
          });
          totalSolved = solvedSet.size;
        }
      }
  
      return {
        handle: user.handle,
        rating: user.rating ?? 0,
        maxRating: user.maxRating ?? 0,
        rank: user.rank ?? "Unranked",
        maxRank: user.maxRank ?? "Unranked",
        avatar: user.avatar,
        totalSolved,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch Codeforces stats");
    }
  }