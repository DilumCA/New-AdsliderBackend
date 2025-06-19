import OpenAI from "openai";
import User from "../models/User.model.js";
import NewAdvertisement from "../models/Newadvertisements.model.js";

// Use OpenRouter's API key and baseURL
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5000", // or your deployed domain
    "X-Title": "Adslider Backend"
  }
});

async function isAdRelevantToUser(user, schemeTags) {
  const prompt = `
You are a smart assistant that matches users to advertisements.

User profile:
${JSON.stringify(user, null, 2)}

Advertisement Scheme Tags:
${JSON.stringify(schemeTags)}

Does this ad match the user? Reply with:
{
  "match": true or false,
  "relevance": 0-100, // percentage of relevance
  "reason": "Short explanation"
}
`;

  const completion = await openai.chat.completions.create({
    model: "opengvlab/internvl3-14b:free",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const response = JSON.parse(completion.choices[0].message.content);
    return response; // { match, relevance, reason }
  } catch (e) {
    return { match: false, relevance: 0, reason: "AI response could not be parsed." };
  }
}

export const getRelevantAdsForUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const ads = await NewAdvertisement.find().populate("selectedSchemeIds").lean();

    const adsWithRelevance = [];
    for (const ad of ads) {
      const allTags = ad.selectedSchemeIds.flatMap(s => s.schemeTags);
      const aiResult = await isAdRelevantToUser(user, allTags);
      adsWithRelevance.push({
        // ...ad,
        _id: ad._id,
        title: ad.title,
        description: ad.description,
        adURL:ad.advertisementURL,
        aiMatch: aiResult.match,
        aiRelevance: aiResult.relevance,
        aiReason: aiResult.reason
      });
    }

    res.json({ advertisements: adsWithRelevance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};