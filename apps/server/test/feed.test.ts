import { parseHtml, translateHtml } from "@/queue/translateQueue";
import { feedRouter } from "@/routers/feed";
import { call } from "@orpc/server";
import { expect, it } from "vitest";
import { getLoginSession } from "./auth.test";
import { rssQueue } from "@/queue/rssQueue";

it("create feed", async () => {
  const session = await getLoginSession();
  const res = await call(
    feedRouter.create,
    {
      // feedUrl: "https://thisweekinreact.com/newsletter/rss.xml",
      // feedUrl: "https://javascriptweekly.com/rss",
      feedUrl: "https://code.visualstudio.com/feed.xml",
      cron: "0 * * * *",
      shouldScrapy: true,
      shouldTranslate: true,
    },
    {
      context: {
        session,
      },
    }
  );
  expect(res?.id).toBeDefined();
});

it("delete feed", async () => {
  const session = await getLoginSession();
  const res = await call(
    feedRouter.delete,
    {
      id: "01e0e1c0-751b-43f5-ae80-f652ce4e956d",
    },
    {
      context: {
        session,
      },
    }
  );
  expect(res?.id).toBeDefined();
});

it.skip("update feed", async () => {
  const session = await getLoginSession();
  const res = await call(
    feedRouter.update,
    {
      id: "03ec6a25-5740-48b1-a7f3-82c0f6a247fa",
      cron: "0 * * * *",
      shouldScrapy: true,
      shouldTranslate: true,
    },
    {
      context: {
        session,
      },
    }
  );
  expect(res?.id).toBeDefined();
});

it("translate html", async () => {
  const html = await translateHtml(
    `<li>
<p>There was some confusion around how the sub-command matching works, this is now explained in detail in the setting's description, but we also support matching against the complete command line.</p>
<pre class="shiki shiki-themes dark-plus light-plus" style="--shiki-dark:#D4D4D4;--shiki-light:#000000;--shiki-dark-bg:#1E1E1E;--shiki-light-bg:#FFFFFF" tabindex="0"><code><span class="line"><span style="--shiki-dark:#CE9178;--shiki-light:#A31515">"chat.tools.terminal.autoApprove"</span><span style="--shiki-dark:#D4D4D4;--shiki-light:#000000">: {</span></span>
<span class="line"><span style="--shiki-dark:#6A9955;--shiki-light:#008000">  // Deny any _command line_ containing a reference to what is likely a PowerShell script</span></span>
<span class="line"><span style="--shiki-dark:#9CDCFE;--shiki-light:#0451A5">  "/</span><span style="--shiki-dark:#D7BA7D;--shiki-light:#EE0000">\\</span><span style="--shiki-dark:#9CDCFE;--shiki-light:#0451A5">.ps1</span><span style="--shiki-dark:#D7BA7D;--shiki-light:#EE0000">\\</span><span style="--shiki-dark:#9CDCFE;--shiki-light:#0451A5">b/i"</span><span style="--shiki-dark:#D4D4D4;--shiki-light:#000000">: { </span><span style="--shiki-dark:#9CDCFE;--shiki-light:#0451A5">"approve"</span><span style="--shiki-dark:#D4D4D4;--shiki-light:#000000">: </span><span style="--shiki-dark:#569CD6;--shiki-light:#0000FF">false</span><span style="--shiki-dark:#D4D4D4;--shiki-light:#000000">, </span><span style="--shiki-dark:#9CDCFE;--shiki-light:#0451A5">"matchCommandLine"</span><span style="--shiki-dark:#D4D4D4;--shiki-light:#000000">: </span><span style="--shiki-dark:#569CD6;--shiki-light:#0000FF">true</span><span style="--shiki-dark:#D4D4D4;--shiki-light:#000000"> }</span></span>
<span class="line"><span style="--shiki-dark:#D4D4D4;--shiki-light:#000000">}</span></span>
<span class="line"></span></code><button>Copy</button></pre>
</li>`,
    "chinese simplified"
  );
  expect(html).toBeDefined();
  console.log(html);
});

it("get scheduler job", async () => {
  const job = await rssQueue.getJobScheduler(
    "repeat:8809524d9352bca981a09efd4d716d89:1755010800000"
  );
  console.log(job);
});
