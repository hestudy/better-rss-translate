import { translateHtml } from "@/queue/translateQueue";
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
      feedUrl: "https://javascriptweekly.com/rss",
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

it.skip("translate html", async () => {
  const html = await translateHtml(
    `<div id="readability-page-1" class="page"><div id="__blog-post-container"><p>Hi everyone!</p>
<p>Apparently, not everyone is on vacation yet because it's a great week.</p>
<p>On the React side, we have an early version of React Server Components support in React Router, and a new comprehensive React Compiler docs.</p>
<p>It's even more exciting for React Native developers: Reanimated v4 is now stable, and Screens now support native tabs, coming soon in Expo!</p>
<p>I also take the opportunity to warn that an <a href="https://socket.dev/blog/npm-is-package-hijacked-in-expanding-supply-chain-attack" target="_blank" rel="noopener noreferrer">npm phishing attack</a> is currently in progress, targeting maintainers of popular packages. Don't trust any email coming from <code>npmjs.org</code>, they are spoofed.</p>
<!-- -->
<p>As always, thanks for supporting us on your favorite platform:</p>
<ul>
<li>🦋 <a href="https://slo.im/last/b" target="_blank" rel="noopener noreferrer">Bluesky</a></li>
<li>✖️ <a href="https://slo.im/last/x" target="_blank" rel="noopener noreferrer">X / Twitter</a></li>
<li>👔 <a href="https://slo.im/last/l" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
<li>👽 <a href="https://slo.im/last/r" target="_blank" rel="noopener noreferrer">Reddit</a></li>
</ul>
<div><p><strong>Don't miss the next email!</strong></p></div>
<p><img src="https://thisweekinreact.com/emails/separators/christmas.png" width="600" height="64"></p>

<p><a href="https://www.ag-grid.com/react-table?utm_source=thisweekinreact&amp;utm_medium=newsletter&amp;utm_campaign=2025-email-2" target="_blank" rel="noopener noreferrer"><img decoding="async" loading="lazy" src="https://thisweekinreact.com/emails/issues/244/aggrid.png" alt="AG Grid: The Best React Data Grid In The World."></a></p>
<p><strong><a href="https://www.ag-grid.com/react-table?utm_source=thisweekinreact&amp;utm_medium=newsletter&amp;utm_campaign=2025-email-2" target="_blank" rel="noopener noreferrer">AG Grid: The Best React Data Grid In The World.</a></strong></p>
<p>AG Grid is a fast, free and fully customisable React Data Grid. Used by <strong>90% of the Fortune 500</strong>, AG Grid is <strong>100% open source</strong> with over <strong>4 million npm downloads per month</strong>:</p>
<ul>
<li>🆓 <strong>Free:</strong> Access 100s of features such as <strong>Sorting</strong>, <strong>Filtering</strong>, <strong>Pagination</strong>, <strong>Cell Editing</strong> and more, all for <strong>free</strong> - forever.</li>
<li>🚀 <strong>Fast:</strong> Display <strong>millions of cells</strong> out of the box, without compromising on performance.</li>
<li>🎨 <strong>Customisable:</strong> Add your own components to cells, rows &amp; columns and use <strong>100+ CSS variables</strong> to style every element.</li>
<li>🏢 <strong>Enterprise Features:</strong> Purchase a licence for lifetime access to advanced features including <strong>Pivoting</strong>, <strong>Grouping</strong>, <strong>Master / Detail</strong> and <strong>Integrated Charts</strong> (powered by our React Charting Library, <a href="https://www.ag-grid.com/charts?utm_source=thisweekinreact&amp;utm_medium=newsletter&amp;utm_campaign=2025-email-2" target="_blank" rel="noopener noreferrer">AG Charts</a>). Try it for free - no trial license required.</li>
</ul>
<p>Learn More: <a href="https://www.ag-grid.com/react-table?utm_source=thisweekinreact&amp;utm_medium=newsletter&amp;utm_campaign=2025-email-2" target="_blank" rel="noopener noreferrer">ag-grid.com</a></p>
<p><img src="https://thisweekinreact.com/emails/separators/christmas.png" width="600" height="64"></p>
<h2 id="react">⚛️ React<a href="#react" aria-label="Direct link to ⚛️ React" title="Direct link to ⚛️ React">•</a></h2>
<p><a href="https://remix.run/blog/react-router-and-react-server-components" target="_blank" rel="noopener noreferrer"><img decoding="async" loading="lazy" src="https://thisweekinreact.com/emails/issues/244/reactrouter.jpg" alt="React Router and React Server Components: The Path Forward"></a></p>
<p><strong><a href="https://remix.run/blog/react-router-and-react-server-components" target="_blank" rel="noopener noreferrer">React Router and React Server Components: The Path Forward</a></strong></p>
<p>The new <a href="https://github.com/remix-run/react-router/blob/main/CHANGELOG.md#v770" target="_blank" rel="noopener noreferrer">React Router v7.7</a> release introduces experimental RSC APIs to use alongside RSC-compatible bundlers (Vite, Parcel) that you can now use in <a href="https://reactrouter.com/start/modes#data" target="_blank" rel="noopener noreferrer">Data Mode</a>, making it almost as powerful as the Framework Mode. In the future, the Framework Mode is also going to migrate to use React Router RSC APIs under the hood.</p>
<p>Reading the <a href="https://reactrouter.com/how-to/react-server-components" target="_blank" rel="noopener noreferrer">React Server Components docs</a>, the integration doesn’t look so simple, so I guess most React Router users may prefer waiting for RSC support in Framework Mode. However, it’s cool that they expose all primitives to bring RSCs to your existing app, and make it possible to create your own RSC-powered Framework Mode somehow.</p>
<p>Other useful links:</p>
<ul>
<li>🐦 <a href="https://x.com/ReactRouter" target="_blank" rel="noopener noreferrer">@ReactRouter - New account to follow on X</a></li>
<li>🎥 <a href="https://www.youtube.com/watch?v=33sAJbf-1NE" target="_blank" rel="noopener noreferrer">Alem Tuzlak - React Server Components Are Finally Here in Vite and React Router!</a></li>
<p>See ya! 👋</p></div></div>`,
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
