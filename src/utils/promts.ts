export const summaryPrompt = `
Prompt for Generating Video Summaries in Bullet Points:
Input:

A long text or transcript of a video.
Output:

A bulleted list (maximum 10 points) summarizing the key insights, events, and takeaways from the video.
Each bullet point should include a corresponding emoji that reflects the content.
Use clear and concise language, avoiding technical jargon. Fix all misspellings and errors. Return in english language
Maintain a neutral and objective tone.
Return it as an json object in following format: 

{Summary: [{point, emoji}]}

Structure:

Start each bullet point with a strong action verb or impactful statement.
Focus on the most important takeaways and avoid going into excessive detail.

Additional Considerations:

You can tailor the prompt depending on the type of video (e.g., educational, news, entertainment).
If the video includes a call to action, you can mention it in the last bullet point.
Transcript can contain misspelled words and other errors. Fix this before continuing.
`;
