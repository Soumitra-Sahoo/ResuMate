import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const getModel = () => genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

export const improveBullet = async (req, res) => {
    try {
        const { text, role = '', company = '' } = req.body
        if (!text?.trim()) return res.status(400).json({ message: 'Text is required' })

        const model = getModel()
        const prompt = `You are a professional resume writer. Rewrite the following work experience bullet point to be more impactful, ATS-friendly, and achievement-focused. Use strong action verbs. Quantify results where possible (add placeholder numbers like "X%" or "N+" if exact figures aren't given). Keep it concise (1-2 sentences max).

Role: ${role || 'Not specified'}
Company: ${company || 'Not specified'}
Original text: "${text}"

Return ONLY the improved bullet point text. No explanations, no quotes, no formatting.`

        const result = await model.generateContent(prompt)
        res.json({ improved: result.response.text().trim() })
    } catch (error) {
        console.error('Gemini improve-bullet error:', error)
        res.status(500).json({ message: 'AI request failed', error: error.message })
    }
}

// POST /api/ai/ats-score
export const getATSScore = async (req, res) => {
    try {
        const { resumeData } = req.body
        if (!resumeData) return res.status(400).json({ message: 'Resume data is required' })

        const model = getModel()
        const resumeText = buildResumeText(resumeData)

        const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze the following resume and provide a detailed ATS score report.

Resume:
${resumeText}

Respond ONLY with a valid JSON object in exactly this format (no markdown, no code blocks):
{
  "overallScore": <number 0-100>,
  "sections": {
    "contactInfo": { "score": <0-100>, "tip": "<one short tip>" },
    "summary": { "score": <0-100>, "tip": "<one short tip>" },
    "workExperience": { "score": <0-100>, "tip": "<one short tip>" },
    "skills": { "score": <0-100>, "tip": "<one short tip>" },
    "education": { "score": <0-100>, "tip": "<one short tip>" },
    "projects": { "score": <0-100>, "tip": "<one short tip>" }
  },
  "topIssues": ["<issue 1>", "<issue 2>", "<issue 3>"],
  "topStrengths": ["<strength 1>", "<strength 2>"],
  "keywordsFound": ["<keyword 1>", "<keyword 2>", "<keyword 3>"],
  "keywordsMissing": ["<missing 1>", "<missing 2>", "<missing 3>"]
}`

        const result = await model.generateContent(prompt)
        let raw = result.response.text().trim().replace(/```json|```/g, '').trim()
        res.json(JSON.parse(raw))
    } catch (error) {
        console.error('Gemini ATS score error:', error)
        res.status(500).json({ message: 'AI request failed', error: error.message })
    }
}

function buildResumeText(r) {
    const lines = []
    if (r.profileInfo?.fullName) lines.push(`Name: ${r.profileInfo.fullName}`)
    if (r.profileInfo?.designation) lines.push(`Title: ${r.profileInfo.designation}`)
    if (r.profileInfo?.summary) lines.push(`Summary: ${r.profileInfo.summary}`)
    const c = r.contactInfo || {}
    lines.push(`Contact: ${[c.email, c.phone, c.location, c.linkedin, c.github].filter(Boolean).join(' | ')}`)
    if (r.workExperience?.length) {
        lines.push('\nWORK EXPERIENCE')
        r.workExperience.forEach(w => {
            lines.push(`- ${w.role} at ${w.company} (${w.startDate} - ${w.endDate})`)
            if (w.description) lines.push(`  ${w.description}`)
        })
    }
    if (r.education?.length) {
        lines.push('\nEDUCATION')
        r.education.forEach(e => lines.push(`- ${e.degree} from ${e.institution}`))
    }
    if (r.skills?.length) lines.push('\nSKILLS: ' + r.skills.map(s => s.name).filter(Boolean).join(', '))
    if (r.projects?.length) {
        lines.push('\nPROJECTS')
        r.projects.forEach(p => lines.push(`- ${p.title}: ${p.description}`))
    }
    if (r.certifications?.length) lines.push('\nCERTIFICATIONS: ' + r.certifications.map(c => `${c.title} (${c.year})`).join(', '))
    return lines.join('\n')
}