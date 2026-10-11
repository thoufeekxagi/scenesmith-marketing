import {PlatformMark} from "./platform-mark";

export function SceneToPost() {
  return <div className="sp-window" role="group" aria-label="ChatGPT publishing preview with X, LinkedIn, and Instagram posts scrolling into an approval and schedule">
    <div className="sp-bar"><i/><i/><i/><span>ChatGPT · SceneSmith</span></div>
    <div className="sp-body">
      <div className="sp-chat">
        <p className="sp-msg sp-user">Turn our launch notes into posts for X, LinkedIn, and Instagram. Schedule all three for tomorrow at 9.</p>
        <p className="sp-msg sp-bot sp-typing"><b/><b/><b/></p>
        <p className="sp-msg sp-bot sp-reply">Drafted for your <strong>SceneSmith</strong> workspace. Review each post on the right, then approve the schedule.</p>
      </div>
      <div className="sp-cards">
        <div className="sp-feed" aria-label="Post previews">
          <div className="sp-feed-track">
            <article className="sp-card"><header><PlatformMark platform="x"/><span>X · @scenesmith</span></header><p>We built SceneSmith so a good idea can go from a conversation to your calendar. Launching this week.</p></article>
            <article className="sp-card"><header><PlatformMark platform="linkedin"/><span>LinkedIn · SceneSmith</span></header><p>Less switching, more creating. Here is how we publish from ChatGPT with approval at every step.</p></article>
            <article className="sp-card"><header><PlatformMark platform="instagram"/><span>Instagram · @scenesmith</span></header><p>A good idea deserves a little room to grow. Sharing the launch, one moment at a time.</p></article>
          </div>
        </div>
        <div className="sp-approve"><span className="sp-btn">Approve &amp; schedule</span><span className="sp-done">Scheduled · Tomorrow 9:00 AM</span></div>
      </div>
    </div>
  </div>;
}
