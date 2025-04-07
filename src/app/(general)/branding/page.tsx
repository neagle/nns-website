import React from "react";

const page = () => {
  return (
    <div className="prose p-4 md:p-6 xl:p-8">
      <h1>Branding &amp; Style Guide</h1>

      <div>
        <h2>Logos</h2>
      </div>
      <div>
        <h2>Colors</h2>
      </div>

      <div>
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
      </div>
    </div>
  );
};

export default page;
