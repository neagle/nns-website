This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

# Todo

What needs to be done for launch?

- [ ] Appropriate og:images on different pages
- [x] Be able to buy subscriptions
- [x] Be able to buy tickets
- [ ] Complete seasons archive
- [x] Add photos to "About Us" page
- [x] Auditions page
- [x] Be able to send messages via Contact Us form
- [x] Link to Facebook and Instagram accounts
- [x] Our Venue page
- [x] Work With Us page

Optional next steps:

- [ ] Feed from Facebook and Instagram accounts
- [x] Individual credits pages for all individuals
- [x] Support us page? Verify that we want this
- [ ] Add video to venue page showing entrance

Assets needed / desired:

- [ ] Photos of people doing various activities
- [ ] Photos of venue


# Notes

* For the "Contact Us" page, I now have it successfully creating submissions that can be viewed in Wix's dashboard, and I assume they're successfully being sent to the site owner email address. (Confirm with Jaclyn!) It doesn't seem like they're being surfaced in the site's unified Inbox, yet. I think the answer to that lies in "automations," but I'm wary about tinkering with something too much that's going to spam NNS folks with emails. This can be addressed later, after talking with Jaclyn about what she wants out of the Contact US form. (3-23-2025)

* CACHING. Much of the site is dynamically generated from the CMS in Wix or from folders within the Media Manager. Next.js caches a lot of its queries, which is great for performance--it loads pages quickly for visitors! But it means that pages that we might expect to update might not update with altered content when we expect them to. We should talk about how to manage appropriate cache times for different pages, and how to give admins the ability to refresh data when needed.
