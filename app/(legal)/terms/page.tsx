"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default function TermsPage() {
  return (
    <main className="max-w-5xl mx-auto p-8 text-gray-800">
      <Card>
      <CardHeader className="text-3xl font-bold mb-6 text-center">
        <CardTitle>Terms and Conditions of Use</CardTitle>
        <CardDescription>        
          Effective Date: 06 October 2025 <br />
          Applicable to: All users of the Botswana Teaching Professionals Council TRLS Portal
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
      <section className="space-y-10">
        {/* 1. Interpretation and Application */}
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Interpretation and Application</h2>
          <ol className="ml-6 space-y-2 list-none">
            <li>
              <span className="font-semibold mr-2">1.1</span>
              These Terms and Conditions govern the access to and use of the Teacher Registration and Licensing System (“TRLS”)
              operated by the Botswana Teaching Professionals Council (“BOTEPCO”).
            </li>
            <li>
              <span className="font-semibold mr-2">1.2</span>
              By accessing or using the System, the User acknowledges that they have read, understood, and agreed to be bound by these Terms and Conditions.
            </li>
            <li>
              <span className="font-semibold mr-2">1.3</span>
              If the User does not agree to these Terms and Conditions, they must refrain from using the System.
            </li>
          </ol>
        </div>

        {/* 2. Purpose of the System */}
        <div>
          <h2 className="text-xl font-semibold mb-2">2. Purpose of the System</h2>
          <ol className="ml-6 space-y-2 list-none">
            <li>
              <span className="font-semibold mr-2">2.1</span>
              The TRLS is an official digital platform established by BOTEPCO to facilitate the registration, licensing, and renewal
              of teaching professionals in accordance with the Botswana Teaching Professionals Council Act, 2019 (Act No. 22 of 2019).
            </li>
            <li>
              <span className="font-semibold mr-2">2.2</span>
              The System is intended solely for legitimate registration and licensing purposes as prescribed by BOTEPCO.
              Any unauthorised, fraudulent, or improper use is strictly prohibited.
            </li>
          </ol>
        </div>

        {/* 3. User Responsibilities */}
        <div>
          <h2 className="text-xl font-semibold mb-2">3. User Responsibilities</h2>
          <ol className="ml-6 space-y-2 list-none">
            <li>
              <span className="font-semibold mr-2">3.1</span>
              The User shall:
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Provide complete, accurate, and truthful information when submitting an application.</li>
                <li>Upload all required supporting documents in the manner prescribed by BOTEPCO.</li>
                <li>Promptly comply with any requests or notifications issued through the System.</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold mr-2">3.2</span>
              The User shall not:
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Provide false, misleading, or fraudulent information.</li>
                <li>Impersonate another person or use another person’s credentials.</li>
                <li>Interfere with, disrupt, or compromise the integrity, availability, or performance of the System.</li>
                <li>Upload or transmit any malicious software, code, or material likely to damage the System.</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold mr-2">3.3</span>
              The User is solely responsible for maintaining the confidentiality of their login credentials and all activities conducted under their profile.
            </li>
          </ol>
        </div>

        {/* 4. Application Process */}
        <div>
          <h2 className="text-xl font-semibold mb-2">4. Application Process</h2>
          <ol className="ml-6 space-y-2 list-none">
            <li><span className="font-semibold mr-2">4.1</span>All fields in the electronic application form are mandatory and must be duly completed.</li>
            <li><span className="font-semibold mr-2">4.2</span>Applications that are incomplete, inaccurate, or accompanied by invalid documentation shall be rejected without liability to BOTEPCO.</li>
            <li><span className="font-semibold mr-2">4.3</span>The User will be notified electronically regarding the status of their application.</li>
            <li><span className="font-semibold mr-2">4.4</span>BOTEPCO reserves the right to request additional information or documentation to verify any aspect of the application.</li>
          </ol>
        </div>

        {/* 5. Payment and Fees */}
        <div>
          <h2 className="text-xl font-semibold mb-2">5. Payment and Fees</h2>
          <ol className="ml-6 space-y-2 list-none">
            <li><span className="font-semibold mr-2">5.1</span>Payment of registration or licensing fees shall become due only after approval by BOTEPCO.</li>
            <li><span className="font-semibold mr-2">5.2</span>The User shall make payment within thirty (30) calendar days from the date of approval notification.</li>
            <li><span className="font-semibold mr-2">5.3</span>Failure to make payment within the prescribed period shall result in automatic closure of the application, requiring reapplication.</li>
            <li><span className="font-semibold mr-2">5.4</span>All payments are strictly non-refundable and non-transferable except as provided under Clause 6.</li>
            <li><span className="font-semibold mr-2">5.5</span>By effecting payment, the User acknowledges that payment constitutes acceptance of these conditions.</li>
          </ol>
        </div>

        {/* 6. Refund Exceptions */}
        <div>
          <h2 className="text-xl font-semibold mb-2">6. Refund Exceptions</h2>
          <ol className="ml-6 space-y-2 list-none">
            <li><span className="font-semibold mr-2">6.1</span>Refunds shall only be considered for:
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Duplicate payments made in error.</li>
                <li>Technical or administrative faults resulting in erroneous charges.</li>
                <li>Service cancellations by BOTEPCO due to internal reasons.</li>
              </ul>
            </li>
            <li><span className="font-semibold mr-2">6.2</span>Refund requests must be submitted in writing within fourteen (14) days with proof of payment and will be processed after verification.</li>
            <li><span className="font-semibold mr-2">6.3</span>Approved refunds shall be processed within twenty-one (21) business days via the original payment method.</li>
            <li><span className="font-semibold mr-2">6.4</span>No refund shall be granted for:
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Change of mind or withdrawal after payment.</li>
                <li>Failure to meet eligibility or submission requirements.</li>
                <li>Partial or full use of a rendered service.</li>
              </ul>
            </li>
          </ol>
        </div>

        {/* 7. System Availability */}
        <div>
          <h2 className="text-xl font-semibold mb-2">7. System Availability</h2>
          <ol className="ml-6 space-y-2 list-none">
            <li><span className="font-semibold mr-2">7.1</span>BOTEPCO shall endeavour to maintain continuous operation of the TRLS, though access may be suspended for maintenance or upgrades.</li>
            <li><span className="font-semibold mr-2">7.2</span>BOTEPCO shall not be liable for inconvenience, delay, or loss arising from such interruptions.</li>
            <li><span className="font-semibold mr-2">7.3</span>The User is responsible for ensuring adequate connectivity, equipment, and software to access the System.</li>
          </ol>
        </div>

        {/* 8. Accuracy and Verification */}
        <div>
          <h2 className="text-xl font-semibold mb-2">8. Accuracy of Information and Verification</h2>
          <ol className="ml-6 space-y-2 list-none">
            <li><span className="font-semibold mr-2">8.1</span>The accuracy and completeness of all information submitted through the System is the sole responsibility of the User.</li>
            <li><span className="font-semibold mr-2">8.2</span>BOTEPCO reserves the right to verify the authenticity of any information or document submitted.</li>
            <li><span className="font-semibold mr-2">8.3</span>False or fraudulent information may result in rejection, revocation of registration, or referral for prosecution.</li>
          </ol>
        </div>

        {/* 9. Disclaimer of Warranties */}
        <div>
          <h2 className="text-xl font-semibold mb-2">9. Disclaimer of Warranties</h2>
          <ol className="ml-6 space-y-2 list-none">
            <li><span className="font-semibold mr-2">9.1</span>The TRLS is provided “as is” and “as available”.</li>
            <li><span className="font-semibold mr-2">9.2</span>BOTEPCO makes no warranties as to accuracy, reliability, or uninterrupted operation of the System.</li>
          </ol>
        </div>

        {/* 10. Limitation of Liability */}
        <div>
          <h2 className="text-xl font-semibold mb-2">10. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, BOTEPCO, its Council members, officers, and employees shall not be liable for any loss, damage, or expense (whether direct, indirect, or consequential) arising from:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Use of or inability to use the System.</li>
            <li>Technical malfunction or interruption.</li>
            <li>Reliance on information obtained through the System.</li>
            <li>Unauthorised access or alteration of submissions.</li>
          </ul>
        </div>

        {/* 11. Breach and Remedies */}
        <div>
          <h2 className="text-xl font-semibold mb-2">11. Breach and Remedies</h2>
          <p>
            In the event of a breach, BOTEPCO may suspend or terminate access, cancel applications or licences, and take appropriate legal or administrative action.
          </p>
        </div>

        {/* 12. Amendment and Review */}
        <div>
          <h2 className="text-xl font-semibold mb-2">12. Amendment and Review</h2>
          <ol className="ml-6 space-y-2 list-none">
            <li><span className="font-semibold mr-2">12.1</span>BOTEPCO may amend these Terms and Conditions at any time without prior notice.</li>
            <li><span className="font-semibold mr-2">12.2</span>Amended Terms shall take effect upon publication on the System.</li>
            <li><span className="font-semibold mr-2">12.3</span>Continued access or use constitutes acceptance of any revisions.</li>
          </ol>
        </div>

        {/* 13. Governing Law */}
        <div>
          <h2 className="text-xl font-semibold mb-2">13. Governing Law and Jurisdiction</h2>
          <ol className="ml-6 space-y-2 list-none">
            <li><span className="font-semibold mr-2">13.1</span>These Terms and Conditions shall be governed by the laws of the Republic of Botswana.</li>
            <li><span className="font-semibold mr-2">13.2</span>Any dispute shall be subject to the exclusive jurisdiction of the courts of Botswana.</li>
          </ol>
        </div>

        {/* 14. Acknowledgement */}
        <div>
          <h2 className="text-xl font-semibold mb-2">14. Acknowledgement and Acceptance</h2>
          <p>
            By selecting “Accept Conditions & Apply”, the User confirms that they have read, understood, and agreed to be bound by these Terms and Conditions of Use.
          </p>
        </div>
      </section>
      </CardContent>
      </Card>
    </main>
  );
}
