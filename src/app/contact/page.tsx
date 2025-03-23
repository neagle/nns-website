import wixClient from "@/lib/wixClient";
import { redirect } from "next/navigation";
import classnames from "classnames";

const ContactPage = async () => {
  async function handleSubmit(formData: FormData) {
    "use server";

    // Extract data from the FormData object
    const firstName = formData.get("name");
    const lastName = formData.get("name");
    const email = formData.get("email");
    const phoneNumber = formData.get("phone");
    const address = formData.get("address");
    const subject = formData.get("subject");
    const message = formData.get("message");

    const fields = {
      first_name_fe01: firstName,
      last_name_b4ca: lastName,
      email_fea1: email,
      phone_1247: phoneNumber,
      address_90dd: address,
      subject: subject,
      message: message,
    };

    // Iterate through the keys and values of the fields object and remove any
    // key/value pairs with empty values.
    for (const [key, value] of Object.entries(fields)) {
      if (!value) {
        delete (fields as Record<string, FormDataEntryValue | null>)[key];
      }
    }
    console.log("fields", fields);

    // Call the Wix SDK with the incoming data
    try {
      console.log("SUBMISSION SUCCESS!");
      console.log(
        "(actual submission to wix is disabled during recaptcha testing)"
      );
      // const createdSubmission = await wixClient.submissions.createSubmission({
      //   formId: "1ff9543e-318e-4617-9535-b4273beac2ea",
      //   submissions: fields,
      // });

      // console.log("created submission", createdSubmission);
    } catch (error) {
      console.error("Error creating submission in Wix:", error);
      throw error;
    }

    redirect("/contact/thanks");
  }

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

      <form
        action={handleSubmit}
        className={classnames(["space-y-4", "required-asterisks"])}
      >
        <div className="md:max-w-1/2 [&_input]:mb-4">
          <div className="md:grid md:grid-cols-2 md:gap-4">
            <div>
              <label htmlFor="firstName" className="block font-medium">
                First Name
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Your first name"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block font-medium">
                Last Name
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Your last name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-medium">
                Email
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="email"
                id="email"
                name="email"
                placeholder="Your email"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block font-medium">
                Phone
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="tel"
                id="phone"
                name="phone"
                placeholder="Your phone number"
              />
            </div>

            <div>
              <label htmlFor="address" className="block font-medium">
                Address
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="text"
                id="address"
                name="address"
                placeholder="Your address"
              />
            </div>
          </div>

          <div>
            <div>
              <label htmlFor="subject" className="block font-medium">
                Subject
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="text"
                id="subject"
                name="subject"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block font-medium">
                Message
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded"
                id="message"
                name="message"
                rows={5}
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full md:btn-wide">
          Send
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
