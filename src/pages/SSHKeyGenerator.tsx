import React, { useState, useEffect } from "react";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import { KeyRound, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const SSHKeyGenerator: React.FC = () => {
  const [passphrase, setPassphrase] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [entropy, setEntropy] = useState<number>(0);
  const [allowEntropy, setAllowEntropy] = useState<boolean>(true);
  const [privateKey, setPrivateKey] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [entropyValues, setEntropyValues] = useState<string>("");

  // Accumulate entropy based on mouse movement
  useEffect(() => {
    const handleMouseMove = () => {
      setEntropy((prev) => {
        if (prev >= 100) {
          window.removeEventListener("mousemove", handleMouseMove); // Stop accumulating entropy
          return prev;
        }

        // Generate pseudo-random entropy value (e.g., random hex values)
        const randomValue = Math.floor(Math.random() * 256)
          .toString(16)
          .padStart(2, "0");
        setEntropyValues((values) => {
          const updatedValues = `${values} ${randomValue}`.trim();
          return updatedValues.split(" ").slice(-100).join(" "); // Limit to last 100 values
        });

        return Math.min(prev + 1, 100); // Increment entropy but cap at 100
      });
    };

    if (allowEntropy) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => window.removeEventListener("mousemove", handleMouseMove); // Cleanup
  }, [allowEntropy]);

  const generateKeyPair = () => {
    if (entropy < 100) {
      setError(
        "⚠️ Please create 100% entropy by moving your mouse over the progress bar."
      );
      return;
    }

    try {
      setError(null);

      // Generate ed25519 keys using TweetNaCl
      const keypair = nacl.sign.keyPair();
      const publicKeyBase64 = naclUtil.encodeBase64(keypair.publicKey);
      const privateKeyBase64 = naclUtil.encodeBase64(keypair.secretKey);

      // OpenSSH formatting for public key
      const publicKeyOpenSSH = `ssh-ed25519 ${publicKeyBase64} ${comment}`;

      setPrivateKey(privateKeyBase64);
      setPublicKey(publicKeyOpenSSH);
      setAllowEntropy(false); // Stop progress bar after generation
    } catch (err) {
      console.error("Key generation failed:", err);
      setError("⚠️ Key generation failed. Please check the parameters.");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .catch(() => setError("⚠️ Failed to copy to clipboard."));
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Update the timestamp format to YYYYMMDD-HHmmss
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T]/g, "")
    .slice(0, 15)
    .replace(/(\d{8})(\d{6})/, "$1-$2"); // Format: YYYYMMDD-HHmmss

  return (
    <>
      <div className="flex justify-center">
        {/* This div makes everything in a container and center aligns it */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 lg:w-2/3">
          {/* Header */}
          <div className="flex md:col-span-2 p-4 gap-2 items-center justify-center">
            {/* Justify will center the items in the middle, Items will align the items */}
            <KeyRound size="30" />
            <h1>SSH Ed25519 Key Generator</h1>
          </div>

          {/* Col 1 */}
          <div className="flex flex-col gap-4 p-4">
            
            <Label htmlFor="passphrase">Passphrase (Optional)</Label>
            <Input
              id="passphrase"
              type="password"
              className="lg:w-1/2"
              placeholder="Enter a passphrase..."
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
            />
            
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Input
              id="comment"
              type="text"
              className="lg:w-2/3"
              placeholder="Enter a comment... example email address or username@hostname"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            
            
            <div
              className={`w-full ${!allowEntropy && "opacity-50"}`}
              onMouseMove={() =>
                allowEntropy && setEntropy((prev) => Math.min(prev + 1, 100))
              }
            >
            <Label htmlFor="entropy" className="flex items-center pb-4">
            Move your mouse to generate entropy
            </Label>  
              <Progress id="progress-entropy" value={entropy} />
              
            </div>
            <Textarea
              id="entropyDisplay"
              value={entropyValues}
              className="p-4 text-gray-400"
              readOnly
              placeholder="Randomness values generated from mouse movements will appear here..."
              rows="4"
            />
            <div>
              <Button
                onClick={generateKeyPair}
                variant="default"
                disabled={entropy < 100}
              >
                <KeyRound /> Generate Key Pair
              </Button>
            </div>
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-4 p-4">
            {/* Add flex-col ^^^^ to stack items on top of each other.  */}

            <Label htmlFor="privateKey">Private Key</Label>
            <Textarea
              id="privateKey"
              value={privateKey}
              readOnly
              rows="4"
              placeholder="Generated private key will appear here..."
              className="p-4"
            />
            <div className="flex gap-4">
              <Button
                onClick={() => handleCopy(privateKey)}
                variant="outline"
                disabled={!privateKey}
              >
                <Copy />
                Copy
              </Button>

              <Button
                onClick={() =>
                  handleDownload(`ed25519-${timestamp}.key`, privateKey)
                }
                variant="outline"
                disabled={!privateKey}
              >
                <Download className="mr-2" /> Download
              </Button>
            </div>

            <Label htmlFor="publicKey">Public Key</Label>
            <Textarea
              id="publicKey"
              value={publicKey}
              rows="4"
              readOnly
              placeholder="Generated public key will appear here..."
              className="p-4"
            />
            <div className="flex gap-4">
              <Button
                onClick={() => handleCopy(publicKey)}
                variant="outline"
                disabled={!publicKey}
              >
                <Copy /> Copy
              </Button>
              <Button
                onClick={() =>
                  handleDownload(`ed25519-${timestamp}.pub`, publicKey)
                }
                variant="outline"
                disabled={!publicKey}
              >
                <Download /> Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SSHKeyGenerator;
