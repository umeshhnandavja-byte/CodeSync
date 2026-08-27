const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql"

const USER_STATS_QUERY = `
  query getUserPublicProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        ranking
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`

type DifficultyCount = {
  difficulty: string
  count: number
}

type LeetCodeGraphQLResponse = {
  data?: {
    matchedUser: {
      username: string
      profile: {
        ranking: number | null
      } | null
      submitStatsGlobal: {
        acSubmissionNum: DifficultyCount[]
      } | null
    } | null
  }
  errors?: { message: string }[]
}

export type LeetCodeUserStats = {
  username: string
  totalSolved: number
  difficulty: {
    easy: number
    medium: number
    hard: number
  }
  globalRanking: number | null
}

export class LeetCodeApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message)
    this.name = "LeetCodeApiError"
  }
}

function countByDifficulty(entries: DifficultyCount[] | undefined, difficulty: string) {
  return entries?.find((entry) => entry.difficulty.toLowerCase() === difficulty)?.count ?? 0
}

export async function getLeetCodeUserStats(username: string): Promise<LeetCodeUserStats> {
  const handle = username.trim()

  if (!handle) {
    throw new LeetCodeApiError("LeetCode username is required.")
  }

  let response: Response

  try {
    response = await fetch(LEETCODE_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        Origin: "https://leetcode.com",
        "User-Agent": "Mozilla/5.0 (compatible; CodeSync/1.0)",
      },
      body: JSON.stringify({
        query: USER_STATS_QUERY,
        variables: { username: handle },
      }),
      cache: "no-store",
    })
  } catch {
    throw new LeetCodeApiError("Could not reach the LeetCode API. Please try again.")
  }

  if (!response.ok) {
    throw new LeetCodeApiError(
      `LeetCode API returned ${response.status} ${response.statusText}.`,
      response.status,
    )
  }

  let payload: LeetCodeGraphQLResponse

  try {
    payload = (await response.json()) as LeetCodeGraphQLResponse
  } catch {
    throw new LeetCodeApiError("LeetCode API returned an invalid response.")
  }

  if (payload.errors?.length) {
    throw new LeetCodeApiError(payload.errors[0]?.message ?? "LeetCode GraphQL query failed.")
  }

  const user = payload.data?.matchedUser

  if (!user) {
    throw new LeetCodeApiError(`No LeetCode user found for handle "${handle}".`, 404)
  }

  const stats = user.submitStatsGlobal?.acSubmissionNum

  return {
    username: user.username,
    totalSolved: countByDifficulty(stats, "all"),
    difficulty: {
      easy: countByDifficulty(stats, "easy"),
      medium: countByDifficulty(stats, "medium"),
      hard: countByDifficulty(stats, "hard"),
    },
    globalRanking: user.profile?.ranking ?? null,
  }
}
