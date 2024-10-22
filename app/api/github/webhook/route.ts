import { createOctokitForUser } from '@/lib/octokit'

export async function POST(request: Request) {
  try {
    const { userId, reponame } = await request.json()
    const { octokit, error, user } = await createOctokitForUser(userId)

    if (error || !octokit) {
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }


    const webhookResponse = await octokit.repos.createWebhook({
      owner: user!.githubUsername,
      repo: reponame,
      config: {
        url: 'https://your-domain.com/api/github/webhook',
        content_type: 'json',
        secret: process.env.GITHUB_WEBHOOK_SECRET
      },
      events: ['push', 'pull_request']
    })

    return new Response(JSON.stringify(webhookResponse.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}