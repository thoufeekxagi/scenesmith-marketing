export type GuideSection = {heading: string; paragraphs?: string[]; steps?: string[]; bullets?: string[]};
export type Guide = {
  slug: string; title: string; description: string; category: string; readTime: string;
  intent: string; answer: string; exampleLabel: string; exampleInput: string; exampleOutput: string;
  intro: string[]; sections: GuideSection[];
  faq: {question: string; answer: string}[];
  primaryAction: {label: string; url: string}; existingAction: {label: string; url: string};
  sources: {label: string; url: string}[];
};

export const BLOG_UPDATED = "2026-10-08";
export const guides: Guide[] = [
  {
    slug: "automate-social-media-posts",
    title: "How to automate social media posts without handing over the final say",
    description: "A practical way to turn one approved brief into separate Instagram, LinkedIn and X posts, then review and schedule them.",
    category: "Social media workflow", readTime: "6 min read",
    intent: "How to automate social media posts with AI",
    answer: "Start with one verified brief. Create a different draft for each platform, review the words and media, approve the destination and time, then check that each post went live. SceneSmith connects that workflow to ChatGPT and keeps the final approval with you.",
    exampleLabel: "Example: one launch note, three posts",
    exampleInput: "Example brief: A fictional print studio opens Saturday at 10 a.m. at 18 King Street. The first 20 visitors get a free print. The owner has approved a storefront photo.",
    exampleOutput: "LinkedIn: “After months of making prints behind closed doors, we are opening the studio this Saturday at 10 a.m. Find us at 18 King Street.” Instagram: “The doors open Saturday at 10. Come see the prints in person at 18 King Street. The first 20 visitors get a free print.” X: “We open Saturday at 10 a.m. at 18 King Street. First 20 visitors get a free print.”",
    intro: ["If you have ever written a post in ChatGPT, copied it into three apps, fixed the formatting three times and then forgotten which version you scheduled, you know the part worth automating. It is the handoff, not your judgment.", "Here is a workable setup for a small team. It uses one source brief, three platform-specific drafts and one review point before anything is scheduled. SceneSmith handles the connection between the chat and your social accounts."],
    sections: [
      {heading: "Build the brief before you open ChatGPT", paragraphs: ["Use facts someone on your team can verify. For the studio example, that means the date, time, address, offer and approved photo. Add the audience and the action you want readers to take. Leave out anything you cannot substantiate."], bullets: ["What happened or what is being offered", "Who it is for", "Exact dates, prices and links", "Images you own or have permission to use", "Anything the assistant must not claim"]},
      {heading: "Connect SceneSmith once", steps: ["Create a SceneSmith workspace for the brand and connect the Instagram, LinkedIn and X accounts you plan to use.", "Open the SceneSmith connection guide and add its hosted MCP endpoint to a compatible ChatGPT workspace. Complete the authorization prompt.", "Ask: ‘Show my SceneSmith setup status.’ Check the workspace and account handles before creating a draft."], paragraphs: ["The endpoint is https://app.scenesmith.design/api/mcp. ChatGPT custom app access depends on your plan and workspace settings. If you do not have access to write-capable custom apps, use the SceneSmith web composer instead of assuming the ChatGPT connection is available."]},
      {heading: "Ask for different posts, not three copies", paragraphs: ["Paste the brief and ask for one post per channel. A LinkedIn post can explain why the launch matters. Instagram needs a real image or video and a caption that fits it. X needs the practical details quickly. Ask the assistant to save drafts and show a preview. Do not ask it to publish in the same instruction."], bullets: ["Prompt: ‘Use only the approved launch details above. Make a LinkedIn post, an Instagram caption for our launch photo and an X post. Show the account and full draft for each. Flag anything that needs checking. Do not schedule yet.’"]},
      {heading: "Approve the version you actually saw", paragraphs: ["Read every post as a customer would. Check the offer, address, links and image. Check that each post points to the correct account and that the schedule uses the time zone you intended. In SceneSmith, the preview is the place to make that decision. Once approved, the calendar and activity record show what is waiting and what has been delivered."], bullets: ["A draft is not a scheduled post.", "A scheduled post is not proof of delivery.", "If a delivery fails, inspect the result before trying again so you do not accidentally post twice."]},
      {heading: "When you can skip a paid tool", paragraphs: ["If you publish to one account and are happy drafting inside that platform, its built-in scheduler may be enough. SceneSmith is useful when the work begins in ChatGPT, several accounts need different versions, and you want one place to review the scheduled result. SceneSmith has a seven-day trial with a card required, followed by a paid plan."]}
    ],
    faq: [
      {question: "Can AI automate social media posts without publishing mistakes?", answer: "It can reduce repetitive drafting and scheduling work. It cannot guarantee that a claim, image or destination is correct. Review the exact post and account before approval."},
      {question: "Can ChatGPT schedule posts without another tool?", answer: "A chat needs an authorized publishing connection to schedule on social platforms. SceneSmith supplies that connection for supported accounts and clients."},
      {question: "Which platforms can SceneSmith publish to?", answer: "Instagram, LinkedIn and X are currently listed as live destinations. Media requirements differ by platform."}
    ],
    primaryAction: {label: "Start your SceneSmith trial", url: "https://app.scenesmith.design/register"},
    existingAction: {label: "Already signed in? Open your composer", url: "https://app.scenesmith.design/login?next=%2Fapp%2Fcreate"},
    sources: [{label: "SceneSmith connection instructions", url: "https://scenesmith.design/connections"}, {label: "OpenAI custom MCP app availability", url: "https://help.openai.com/en/articles/12584461-developer-mode-and-full-mcp-connectors-in-chatgpt"}]
  },
  {
    slug: "chatgpt-linkedin-posts",
    title: "How to schedule a LinkedIn post from ChatGPT",
    description: "Connect the right LinkedIn account, write from real source notes, review the post and schedule it with SceneSmith.",
    category: "LinkedIn guide", readTime: "5 min read",
    intent: "Schedule LinkedIn posts with ChatGPT",
    answer: "Connect LinkedIn to a SceneSmith workspace, authorize SceneSmith in a compatible ChatGPT workspace, ask for a draft, review the exact account and time, then approve the schedule. If you only need free LinkedIn scheduling, use LinkedIn's native scheduler.",
    exampleLabel: "Example: turn a product note into a post",
    exampleInput: "Example brief for a fictional analytics company: A weekly report export is available today. Three customers asked for an easier way to share reports with finance. Do not name customers or invent results.",
    exampleOutput: "“A report is only useful if the people who need it can actually read it. Three customers told us their finance teams needed a simpler handoff, so we added a weekly export. It is available today. If your team passes reports between departments, this one is for you.”",
    intro: ["The awkward part of writing a LinkedIn post in ChatGPT is what happens next. You still need to copy the text, find the right company Page or profile, choose a time and check that the post actually went out.", "SceneSmith can carry the draft from ChatGPT to your LinkedIn destination. This walkthrough shows the connection and the review step. If you prefer to write inside LinkedIn, its own scheduler is free and may be all you need."],
    sections: [
      {heading: "First, connect the LinkedIn destination", steps: ["Sign in to SceneSmith and choose the workspace for the brand.", "Open Connections in the app and connect the LinkedIn profile or Page you are authorized to publish to.", "Read back the exact destination name. Do not assume your personal profile and company Page are interchangeable."], paragraphs: ["If the destination does not appear, check the account authorization in SceneSmith before trying to schedule from ChatGPT."]},
      {heading: "Add SceneSmith to ChatGPT", steps: ["Open the SceneSmith connection guide. Copy the production MCP endpoint: https://app.scenesmith.design/api/mcp.", "In a ChatGPT workspace that supports write-capable custom MCP apps, add the endpoint using its current Apps or developer settings and complete SceneSmith authorization.", "In a new chat, ask ‘Show my SceneSmith setup status.’ Confirm the workspace and LinkedIn account shown in the response."], paragraphs: ["OpenAI changes these menus and limits access by plan and workspace. Follow the current OpenAI instructions linked below if the option is missing. You can still create a LinkedIn draft in SceneSmith's web composer."]},
      {heading: "Give ChatGPT a real note to work from", paragraphs: ["A vague request such as ‘write a thought leadership post’ produces a vague post. Give it the source note, a specific reader and a point of view. In the example above, the useful story is that finance teams needed a way to pass a report along. The post should explain that problem before announcing the feature."], bullets: ["Try: ‘Draft a LinkedIn post for product managers using only the note above. Keep the customer anonymous. Explain the problem, what changed and who can use the export. Save it as a draft for [exact LinkedIn account]. Show me the full preview. Do not schedule yet.’"]},
      {heading: "Review the preview, then choose a time", paragraphs: ["Check the first two lines, every factual claim, any link, the destination and the scheduled time. Be explicit about time zone. If a sentence sounds like a claim you could not defend to a customer, revise it before approval. Then schedule the version you reviewed."], bullets: ["If you scheduled in SceneSmith, look in SceneSmith's calendar and activity record.", "If you scheduled natively in LinkedIn, look in LinkedIn's scheduled-post view.", "After the due time, check for a delivery result. A queued post and a published post are different states."]},
      {heading: "Should you use LinkedIn's free scheduler instead?", paragraphs: ["Yes, if you only need to schedule a post you wrote in LinkedIn. SceneSmith earns its place when you already work in ChatGPT, manage more than one brand or channel, or want the draft, approval and delivery record together. It has a card-required seven-day trial and paid plans after that."]}
    ],
    faq: [
      {question: "Can ChatGPT post directly to LinkedIn?", answer: "Only through an authorized publishing connection. ChatGPT writing the text does not give it permission to publish to your LinkedIn account."},
      {question: "Is scheduling a LinkedIn post free?", answer: "LinkedIn's built-in scheduler is free for supported post types. SceneSmith is a separate paid workflow for drafting and publishing from connected tools."},
      {question: "Where can I see a post scheduled through SceneSmith?", answer: "Check the SceneSmith calendar or activity record. It may not appear in LinkedIn's native scheduled-post list before delivery."}
    ],
    primaryAction: {label: "Start your SceneSmith trial", url: "https://app.scenesmith.design/register"},
    existingAction: {label: "Already signed in? Connect LinkedIn", url: "https://app.scenesmith.design/login?next=%2Fapp%2Fconnections"},
    sources: [{label: "SceneSmith connection instructions", url: "https://scenesmith.design/connections"}, {label: "LinkedIn: schedule posts", url: "https://www.linkedin.com/help/linkedin/answer/a1347212"}, {label: "OpenAI custom MCP app availability", url: "https://help.openai.com/en/articles/12584461-developer-mode-and-full-mcp-connectors-in-chatgpt"}]
  },
  {
    slug: "chatgpt-instagram-posts",
    title: "How to publish an Instagram post from ChatGPT",
    description: "What you need before posting, how to connect Instagram, and how to check the media and caption before they go live.",
    category: "Instagram guide", readTime: "5 min read",
    intent: "Post to Instagram from ChatGPT",
    answer: "Connect an eligible Instagram account to SceneSmith, add SceneSmith to a compatible ChatGPT workspace, provide an image or video, and ask for a draft. Review the actual media, caption, account and time before approving publication. A caption alone is not an Instagram post.",
    exampleLabel: "Example: one photo, one clear invitation",
    exampleInput: "Example brief for a fictional ceramics shop: Photo of a finished mug. Handmade in Toronto. Available Friday for CAD 38. No stock or shipping claim.",
    exampleOutput: "“The mug we kept reaching for in the studio is almost ready for your shelf. Handmade in Toronto and available Friday for CAD 38. See the finished piece in the photo.” The image, caption and handle are reviewed together.",
    intro: ["ChatGPT can write a caption in seconds. It cannot turn that caption into an Instagram post unless a publishing connection has access to your account and the post has usable media.", "SceneSmith gives you a way to create the draft in a compatible ChatGPT workspace, inspect the image or video with the caption, and approve the exact post. Here is the setup, using a simple product photo as the example."],
    sections: [
      {heading: "Check the account and the asset", steps: ["Sign in to SceneSmith and connect the Instagram account in the right workspace. Confirm the displayed handle.", "Choose the media before writing the caption. A single image post needs one image. A carousel uses multiple assets. A Reel uses video.", "Make sure you own or can use the photo or video, and that the product details in your brief are correct."], paragraphs: ["SceneSmith's current publishing adapter supports image posts, carousels and Reels. This guide does not promise Story publishing. The app will validate media and account requirements before a post is approved."]},
      {heading: "Connect SceneSmith to ChatGPT", steps: ["Open the SceneSmith connection guide and copy https://app.scenesmith.design/api/mcp.", "Add SceneSmith in a ChatGPT workspace with write-capable custom MCP app access, then authorize the same SceneSmith account that holds your Instagram connection.", "Ask ‘Show my SceneSmith setup status.’ Check the Instagram handle before you request a draft."], paragraphs: ["If your ChatGPT plan or workspace does not expose this connection, use SceneSmith's web composer. The publishing account is still managed in SceneSmith."]},
      {heading: "Show the photo and ask for a draft", paragraphs: ["For the mug example, a useful instruction is: ‘Use this photo and only these facts: handmade in Toronto, available Friday, CAD 38. Draft one Instagram image post for [exact handle]. Do not invent stock or shipping claims. Show me the image and full caption before publishing.’"], bullets: ["Check that the image is the one you intended.", "Check the first line of the caption before adding hashtags.", "Check the price, availability date, handle and any link or call to action."]},
      {heading: "Approve and check the result", paragraphs: ["Once the media, caption, account and time look right, approve that version. SceneSmith schedules or publishes it and records the delivery result. If Instagram is still processing a video or rejects an asset, inspect the result before retrying. That prevents duplicate posts."], bullets: ["A draft is safe to edit.", "A scheduled post is waiting to be sent.", "A delivery receipt tells you whether the platform accepted it."]},
      {heading: "When to finish in Instagram itself", paragraphs: ["Use Instagram's own app for an in-app effect or format that a connected publisher does not support. SceneSmith is for the formats its composer confirms it can send. It has a seven-day trial with a card required, then a paid plan."]}
    ],
    faq: [
      {question: "Can I post a text-only Instagram caption from ChatGPT?", answer: "No. Instagram feed publishing needs media. Prepare a supported image or video and review it with the caption."},
      {question: "Can SceneSmith publish carousels and Reels?", answer: "The current SceneSmith adapter includes image posts, carousels and Reels. The composer checks the relevant media requirements before approval."},
      {question: "Will it post as soon as ChatGPT writes the caption?", answer: "No. SceneSmith shows the complete post and destination for review before publishing or scheduling."}
    ],
    primaryAction: {label: "Start your SceneSmith trial", url: "https://app.scenesmith.design/register"},
    existingAction: {label: "Already signed in? Connect Instagram", url: "https://app.scenesmith.design/login?next=%2Fapp%2Fconnections"},
    sources: [{label: "SceneSmith connection instructions", url: "https://scenesmith.design/connections"}, {label: "OpenAI custom MCP app availability", url: "https://help.openai.com/en/articles/12584461-developer-mode-and-full-mcp-connectors-in-chatgpt"}]
  }
];

export function guideBySlug(slug: string) { return guides.find((guide) => guide.slug === slug); }
