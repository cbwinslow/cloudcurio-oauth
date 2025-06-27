import React from "react";

export function FAQ() {
  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      <div className="mb-4">
        <h3 className="font-semibold">How secure is this portal?</h3>
        <p>
          All authentication, session, and traffic data is handled securely with encryption, audit logging, and role-based access.
        </p>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">How do I reset my account?</h3>
        <p>
          Use the data export/delete endpoints or contact an administrator for help.
        </p>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">What data do you store?</h3>
        <p>
          We store only necessary user, token, audit, and traffic data as described in the privacy policy.
        </p>
      </div>
    </div>
  );
}