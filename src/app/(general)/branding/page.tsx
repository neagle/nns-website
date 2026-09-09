import type { Metadata } from "next";
import React from "react";
import Colors from "./Colors";
import Link from "next/link";
import Image from "next/image";
import LogoGenerator from "@/app/components/LogoGenerator";

export const metadata: Metadata = {
  title: "Branding & Style Guide",
  description: "Branding & Style Guide for NOVA Nightsky Theater.",
};

const page = async () => {
  return (
    <div className="prose p-4 md:p-6 xl:p-8">
      <h1>Branding &amp; Style Guide</h1>

      <ul>
        <li>
          <Link href="#logos">Logos</Link>
        </li>
        <li>
          <Link href="#colors">Colors</Link>
        </li>
        <li>
          <Link href="#fonts">Fonts</Link>
        </li>
        <li>
          <Link href="#hashtags">Hashtags</Link>
        </li>
        <li>
          <Link href="#qr-codes">QR Codes</Link>
        </li>

        <li>
          <Link href="#headshots">Headshots</Link>
        </li>

        <li>
          <Link href="#content-guidelines">Content Guidelines</Link>
        </li>
        <li>
          <Link href="#testing">Testing</Link>
        </li>
      </ul>

      <section id="logos">
        <h2>Logos</h2>
        <LogoGenerator />
      </section>

      <section id="colors">
        <Colors />
      </section>

      <section id="fonts">
        <h2>Fonts</h2>
        <div className="card card-border bg-base-300">
          <div className="card-body">
            <h1 className="card-title">Dunbar Low for Headlines</h1>
            <p>Noah for body text.</p>
          </div>
        </div>
      </section>

      <section id="hashtags">
        <h2>Hashtags</h2>
        <p>
          Events (specific performances of shows) can have hashtags in their
          short description fields. These will be displayed as info badges at
          the top of their showtime card. They should use kebab-case formatting
          (ie, "understudy-performance") and will be parsed to display as
          "#understudy-performance".
        </p>
      </section>

      <section id="qrcodes">
        <h2>QR Codes</h2>
        <p>
          You can generate a downloadable QR code for any page on the site by
          clicking the &ldquo;NOVA Nightsky Theater&rdquo; text in the footer.
          (You can also append the{" "}
          <code className="whitespace-nowrap">?qrCode</code> query string to the
          URL to do the same thing.)
        </p>
        <p>
          That will generate a QR Code that links to that specific URL. You can
          use this to generate codes for specific shows or pages.
        </p>
        <p>
          QR codes can also include Google Analytics-friendly tracking
          parameters. The QR code panel includes a simple campaign field for
          flyer names, plus an advanced editor for full UTM fields when you need
          more control.
        </p>
        <Link className="link" href="/?qrCode">
          View the homepage with a QR Code.
        </Link>
      </section>

      <section id="headshots">
        <h2>Headshots</h2>

        <Image
          src="/images/photographs/general/kay-ward.jpg"
          width="500"
          height="624"
          alt="Ward Kay's headshot"
          className="w-[150px] border-2 border-white float-left mr-4"
        />

        <p>
          The aspect ratio for headshots should be <strong>4 x 5</strong>. They
          should be stored in the{" "}
          <Link href="https://manage.wix.com/dashboard/7de3ab74-f80e-4690-9183-26f151c5fd06/media-manager?path=%2Fsources%2Fprivate%2F4ec9381b6cfb461ab296a4ccdc576f9d%3FselectedItem%3D">
            <code>headshots</code> directory in Wix&rsquo;s media manager
          </Link>{" "}
          with a filename in the format of{" "}
          <code className="whitespace-nowrap">lastName-firstName.jpg</code>.
        </p>
      </section>

      <section id="content-guidelines" className="clear-both">
        <h2>Content Guidelines</h2>
        <ul>
          <li>
            <strong>Use of the word &ldquo;theater:&rdquo;</strong> notice that
            we spell it with an &ldquo;er&rdquo;, not an &ldquo;re.&rdquo;
          </li>
          <li>
            <strong>
              <span className="text-error">NEEDS CHECK</span>
            </strong>
            : Prefer use of &ldquo;actor&rdquo; for women to
            &ldquo;actress.&rdquo;
          </li>
        </ul>
      </section>

      <section id="testing" className="clear-both">
        <h2>Testing</h2>
        <p>
          There&rsquo;s a permanent, unlisted Wix event for exercising the box
          office checkout flow (reservation → Wix hosted checkout → redirect
          back to the site) without booking a real show or charging a real
          card. It&rsquo;s a Pay What You Can ticket with a $0 minimum, so it
          completes Wix&rsquo;s full checkout/payment page for $0.
        </p>
        <p>
          Its Wix event title is prefixed with{" "}
          <code className="whitespace-nowrap">[TEST]</code>, which the box
          office listing filters out, so it never appears publicly &mdash;
          it&rsquo;s only reachable via its direct URL below.
        </p>
        <p>
          Event ID:{" "}
          <code className="whitespace-nowrap">
            0c5c610a-8539-4aaf-a073-20ad8b005048
          </code>
        </p>
        <Link
          className="link"
          href="/box-office/0c5c610a-8539-4aaf-a073-20ad8b005048"
        >
          Open the test event&rsquo;s checkout page.
        </Link>
      </section>
    </div>
  );
};

export default page;
