
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">DATA PRIVACY NOTICE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <p className="text-sm text-muted-foreground mb-4">
              For the purposes of this privacy notice &ldquo;processing&rdquo; means any operation/activity/set of operations,
              including automatic, concerning your personal data (as defined below) and adaptation alignment,
              alteration, blocking, collation, collection, combination, consultation, degradation, destruction, disclosure
              by transmission, dissemination by means of transmission, distribution or making available in any other
              form, erasure, gathering, linking, merging, modification, organisation, receipt, recording, restriction,
              retrieval, storage, structuring, updating, or use of the personal data.
            </p>
          </section>

          <section>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  For the purposes of this privacy notice <strong>&ldquo;personal data&rdquo;</strong> means 
                  any information relating to an identified or identifiable natural person, or data subject; and an identifiable natural person is one who
                  can be identified, directly or indirectly, by reference to an identifier such as a name, an identification
                  number, location data, an online identifier or to one or more factors specific to the physical,
                  physiological, genetic, mental, economic, cultural or social identity of that natural person.
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  For the purposes of this privacy notice <strong>&ldquo;The Council&rdquo;</strong> means
                  Botswana Teaching Professionals Council and incorporated under the laws of the Republic of Botswana by Act No. 22 of 2019.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Data Collection</h2>
            <p className="text-sm text-muted-foreground">
              The Council collects your personal data as follows as part of your application and use of the platform: 
              Full names, Contact information (postal and physical address, email, phone number), Date of birth, 
              Marital Status, Certified copies of academic certificates, Citizenship and Identification details 
              and identification documents (e.g., national ID, passport), Sex and Employment details. 
              By providing your personal data, you consent to BOTEPCO sharing your personal data and also warrant 
              that you have the necessary consent from the individuals to share their information with the Council (i.e. Spouses).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. The Purpose of Data Collection and Processing</h2>
            <p className="text-sm text-muted-foreground">
              Applicants personal data will be collected for the purpose of facilitating the operations of the Council 
              in accordance with Section 5 of the Botswana Teaching Professionals Council Act (Act No. 22 of 2019).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Legal Basis for Processing your Personal Data</h2>
            <p className="text-sm text-muted-foreground">
              We will collect and process your personal data with your consent. There may be instances where your 
              consent is not required for processing of your personal data. These include where the Council is 
              required to comply with a legal obligation or where the Council process your personal data to perform 
              a contractual obligation with you or where processing is required to protect your vital interest or 
              those of another or processing is carried out in the public interest or is necessary to protect the 
              vital interests of the Council.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Your Rights</h2>
            <p className="text-sm text-muted-foreground">
              Subject to the necessary legal limitations, You have the right to: Access your personal data and 
              request corrections, withdraw your consent to processing, request the deletion of your personal 
              data under certain conditions object to the processing of your personal data, request for data 
              minimization and anonymisation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Data Security</h2>
            <p className="text-sm text-muted-foreground">
              The Council and its 3rd party service providers, agents and representatives (either based in 
              Botswana or abroad) use appropriate security measures to protect your personal data from 
              unauthorized access, theft, negligent loss and the Council uses appropriate security measures 
              to protect your personal data during transmission and storage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Retention Period</h2>
            <p className="text-sm text-muted-foreground">
              As required by law, we will retain your personal data for no longer than necessary to fulfil 
              the purposes for which it was collected after which it will be securely deleted or anonymized.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Consent</h2>
            <p className="text-sm text-muted-foreground">
              By signing off or submitting this application, you consent to the processing of your personal 
              data as described in this privacy notice.
            </p>
          </section>

          <section className="pt-6 border-t">
            <div className="text-center">
          

            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}