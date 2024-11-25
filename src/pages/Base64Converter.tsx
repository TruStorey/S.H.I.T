import React, { useState, useEffect } from 'react';
import { Binary, Copy, ClipboardPenLine } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Base64Converter = () => {
  const [stringInput, setStringInput] = useState<string>('');
  const [base64Input, setBase64Input] = useState<string>('');
  const [encodedOutput, setEncodedOutput] = useState<string>('');
  const [decodedOutput, setDecodedOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Update encoded output when the string input changes
  useEffect(() => {
    setEncodedOutput(btoa(stringInput)); // Directly encode without error handling
  }, [stringInput]);

  // Update decoded output when the Base64 input changes
  useEffect(() => {
    try {
      setError(null);
      setDecodedOutput(atob(base64Input));
    } catch (err) {
      setDecodedOutput('');
      setError('⚠️ Invalid Base64 string...');
    }
  }, [base64Input]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => setError('Failed to copy.'));
  };

  const handlePaste = async (setInput: React.Dispatch<React.SetStateAction<string>>) => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      setError('Failed to paste.');
    }
  };

  return (
    <>
      <div className="md:flex flex-1 p-4 gap-2 items-center justify-center">
        {/* Header */}
        <Binary size="30" />
        <h1>Encode or decode Base64 strings</h1>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {/* Column 1: String to Base64 */}
      <div className="space-y-4">
      <Button
          onClick={() => handlePaste(setStringInput)}
          variant="outline"
        >
          <ClipboardPenLine />Paste
        </Button>
        <Textarea
          value={stringInput}
          onChange={(e) => setStringInput(e.target.value)}
          placeholder="Enter string to encode..."
          className="p-4 w-full h-full"
        />   
        <Textarea
          value={encodedOutput}
          readOnly
          placeholder="Encoded Base64 will appear here..."
          className="p-4 w-full h-full"
        />
        <Button
          onClick={() => handleCopy(encodedOutput)}
          variant="outline"
          disabled={!encodedOutput}
        >
          <Copy /> Copy
        </Button>
      </div>

      {/* Column 2: Base64 to String */}
      <div className="space-y-4">
      <Button
          variant="outline"
          onClick={() => handlePaste(setBase64Input)}
        >
          <ClipboardPenLine />Paste
        </Button>
        <Textarea
          value={base64Input}
          onChange={(e) => setBase64Input(e.target.value)}
          placeholder="Enter Base64 string to decode..."
          className="p-4 w-full h-full"
        />
        <Textarea
          value={decodedOutput}
          readOnly
          placeholder={error && !decodedOutput ? error : "Decoded string will appear here..."}
          className="p-4 w-full h-full"
        />
        <Button
          onClick={() => handleCopy(decodedOutput)}
          variant="outline"
          disabled={!decodedOutput}
        >
          <Copy /> Copy
        </Button>
      </div>
    </div>
    </>
  );
};

export default Base64Converter;
