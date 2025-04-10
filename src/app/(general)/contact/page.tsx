import ContactForm from "./ContactForm";

const ContactPage = async () => {
  /*
  // Here for historical purposes: if you're trying to find out what your form's
  // ID actually is, this is a good way to find all the forms your SDK is aware
  // of.
  const myForms = await wixClient.forms
    .queryForms()
    .eq("namespace", "wix.form_app.form")
    .find();
  console.log("myForms", myForms);
  */

  /*
  // Also here for historical reasons. This is a good way to make sure you're
  // interacting with the right form.
  const numSubmissions = wixClient.submissions.countSubmissions(
    ["1ff9543e-318e-4617-9535-b4273beac2ea"],
    "wix.form_app.form",
    {}
  );
  console.log("num submissions", numSubmissions);
  */

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <ContactForm />
    </div>
  );
};

export default ContactPage;
