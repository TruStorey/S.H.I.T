import React, { useState } from "react";
import forge from "node-forge";
import { ShieldCheck, Award, ClipboardPenLine, Building, User, CalendarCheck, CalendarX, Hash } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CertChecker: React.FC = () => {
  const [certContent, setCertContent] = useState<string>("");
  const [certDetails, setCertDetails] = useState<{
    issuer?: string;
    subject?: string;
    validFrom?: string;
    validTo?: string;
    serialNumber?: string;
    isCA?: boolean;
    pathLength?: number | null;
    commonName?: string;
    isIntermediate?: boolean;
    aiaUri?: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseCertificate = (pem: string) => {
    try {
      const cert = forge.pki.certificateFromPem(pem);
      const subjectCN = cert.subject.getField("CN")?.value || "";
      const basicConstraints = cert.getExtension("basicConstraints");
      const aiaExtension = cert.getExtension("authorityInfoAccess");
      const aiaUri =
        aiaExtension?.accessDescriptions?.find(
          (desc) => desc.accessMethod === "1.3.6.1.5.5.7.48.2"
        )?.accessLocation?.value || null;

      return {
        issuer: cert.issuer.attributes
          .map((attr) => `${attr.name}=${attr.value}`)
          .join(", "),
        subject: cert.subject.attributes
          .map((attr) => `${attr.name}=${attr.value}`)
          .join(", "),
        validFrom: cert.validity.notBefore.toISOString(),
        validTo: cert.validity.notAfter.toISOString(),
        serialNumber: cert.serialNumber,
        isCA: basicConstraints?.cA || false,
        pathLength: basicConstraints?.pathLenConstraint || null,
        commonName: subjectCN,
        isIntermediate: basicConstraints?.cA && aiaUri !== null,
        aiaUri: aiaUri,
      };
    } catch (err) {
      console.error("Certificate parsing failed:", err);
      return null;
    }
  };

  const handleCertChange = (value: string) => {
    setCertContent(value);

    if (!value) {
      setCertDetails(null);
      setError(null);
      return;
    }

    const parsedDetails = parseCertificate(value);
    if (parsedDetails) {
      setCertDetails(parsedDetails);
      setError(null);
    } else {
      setCertDetails(null);
      setError(
        "⚠️ Invalid certificate format. Please paste a valid PEM-encoded certificate."
      );
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCertContent(text);
      handleCertChange(text);
    } catch {
      setError("⚠️ Failed to paste from clipboard.");
    }
  };

  const getCertificateTypeClassName = (cert: typeof certDetails) => {
    if (!cert) return "";
    if (cert.isCA && cert.isIntermediate) return "bg-yellow-600";
    if (cert.isCA && !cert.isIntermediate) return "bg-green-600";
    return "bg-blue-600";
  };

  const getCertificateTypeDescription = (cert: typeof certDetails) => {
    if (!cert) return "";
    if (cert.isCA && cert.isIntermediate) return "This is an Intermediate CA certificate";
    if (cert.isCA && !cert.isIntermediate) return "This is a Root CA certificate";
    return "This is an end-entity certificate";
  };

  return (
    <>
      <div className="flex justify-center">
        {/* This div makes everything in a container and center aligns it */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 lg:w-2/3">
          {/* Header */}
          <div className="flex md:col-span-2 p-4 gap-2 items-center justify-center">
            {/* Justify will center the items in the middle, Items will align the items */}
            <Award />
        <h1>Inspect the contents of a certificate</h1>
          </div>

          {/* Col 1 */}
          <div className="flex flex-col gap-4 p-4">
          <Textarea
            placeholder="Paste the contents of the certificate here..."
            className="p-4 "
            rows="30"
            value={certContent}
            onChange={(e) => handleCertChange(e.target.value)}
          />
          <div>
          <Button onClick={handlePaste} variant="outline">
            <ClipboardPenLine /> Paste
          </Button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          {/* Col 2 */}
          <div className="flex gap-4 p-4 ">
            {/* Add flex-col ^^^^ to stack items on top of each other.  */}

            {certDetails && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex gap-2">
                    <Award /> {certDetails.commonName || "Unknown"}
                  </div>
                </CardTitle>
                <CardDescription

                >
                  <Badge className={getCertificateTypeClassName(certDetails)}>
                  {getCertificateTypeDescription(certDetails)}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-2">
                    <Building />
                    Issuer:
                     <strong>{certDetails.issuer}</strong>
                  </div>
                  <div className="flex gap-2">
                  <User />
                    Subject: <strong>{certDetails.subject}</strong>
                  </div>
                  <div className="flex gap-2">
                  <CalendarCheck />
                    Valid From:{" "}
                    <strong>
                      {new Date(certDetails.validFrom).toLocaleString()}
                    </strong>
                  </div>
                  <div className="flex gap-2">
                  <CalendarX />
                    Valid To:{" "}
                    <strong>
                      {new Date(certDetails.validTo).toLocaleString()}
                    </strong>
                  </div>
                  <div className="flex gap-2">
                  <Hash />
                    Serial Number: <strong>{certDetails.serialNumber}</strong>
                  </div>
                  <div className="flex gap-2">
                  <ShieldCheck />
                    Is Certificate Authority (CA):{" "}
                    <strong>{certDetails.isCA ? "Yes" : "No"}</strong>
                  </div>
                  {certDetails.isCA && certDetails.pathLength !== null && (
                    <div className="flex gap-2">
                      Path Length Constraint: <strong>{certDetails.pathLength}</strong>
                    </div>
                  )}
                  {certDetails.isIntermediate && certDetails.aiaUri && (
                    <div className="flex gap-2">
                      Issuer Certificate URI: <strong>{certDetails.aiaUri}</strong>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
          </div>

         


        </div>
      </div>
    </>
  );
};

export default CertChecker;
