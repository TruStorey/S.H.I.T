import React, { useState, useEffect } from "react";
import { ListMinus, Plus, Trash2, Copy, ClipboardPenLine } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TransformList: React.FC = () => {
  const [listInput, setListInput] = useState("");
  const [findReplaceRules, setFindReplaceRules] = useState([]);
  const [encloseRules, setEncloseRules] = useState([]);
  const [formattedOutput, setFormattedOutput] = useState("");
  const [outputFormat, setOutputFormat] = useState("singleLine");

  // Declare toast
  const { toast } = useToast();

  // Paste clipboard contents into input-list
  const handlePaste = async () => {
    const clipboardText = await navigator.clipboard.readText();
    setListInput(clipboardText);
  };

  // Copy contents of output-list to clipboard
  const handleCopy = async () => {
    await navigator.clipboard.writeText(formattedOutput);
    toast({
      title: "Copied to clipboard",
      description: "The transformed list has been copied.",
    });
  };

  // Add a new Find/Replace rule
  const addFindReplaceRule = () => {
    setFindReplaceRules([
      ...findReplaceRules,
      { find: "", replaceOption: "REMOVE", customReplace: "", id: Date.now() },
    ]);
  };

  // Add a new Enclose rule
  const addEncloseRule = () => {
    setEncloseRules([
      ...encloseRules,
      {
        option: '"',
        position: "both",
        customValue: "",
        id: Date.now(),
        scope: "list-item",
      },
    ]);
  };

  // Dynamically update formattedOutput based on listInput and outputFormat
  useEffect(() => {
    const formatOutput = () => {
      if (!listInput) {
        setFormattedOutput("");
        return;
      }

      const isMultiLine = listInput.includes("\n");
      let lines = isMultiLine
        ? listInput.split("\n").map((item) => item.trim())
        : listInput.split(/[\s,]+/).filter((item) => item.trim());

      // Apply Find/Replace Rules
      findReplaceRules.forEach((rule) => {
        const replaceWith =
          rule.replaceOption === "custom"
            ? rule.customReplace || ""
            : rule.replaceOption;
        if (rule.find) {
          const findRegex = new RegExp(rule.find, "g");
          lines = lines.map((line) =>
            replaceWith === "REMOVE"
              ? line.replace(findRegex, "")
              : line.replace(findRegex, replaceWith)
          );
        }
      });

      // Apply Enclose Rules
      encloseRules.forEach((enclose) => {
        const encloseChar =
          enclose.option === "custom"
            ? enclose.customValue || ""
            : enclose.option;

        if (encloseChar) {
          switch (enclose.scope) {
            case "list-item":
              lines = lines.map(
                (line) => `${encloseChar}${line}${encloseChar}`
              );
              break;
            case "prefix":
              lines = lines.map((line) => `${encloseChar}${line}`);
              break;
            case "suffix":
              lines = lines.map((line) => `${line}${encloseChar}`);
              break;
            case "list":
              // Format the lines first, then apply enclosing characters
              let formattedList;
              switch (outputFormat) {
                case "singleLine":
                  formattedList = lines.join(" ");
                  break;
                case "multiLine":
                  formattedList = lines.join("\n");
                  break;
                case "commaSeparatedSingleLine":
                  formattedList = lines.join(",");
                  break;
                case "commaSeparatedSingleLineWithSpace":
                  formattedList = lines.join(", ");
                  break;
                case "commaSeparatedMultiLine":
                  formattedList = lines.join(",\n");
                  break;
                case "tabSeparatedSingleLine":
                  formattedList = lines.join("\t");
                  break;
                default:
                  formattedList = lines.join(" ");
                  break;
              }
              lines = [`${encloseChar}${formattedList}${encloseChar}`];
              break;
            default:
              break;
          }
        }
      });

      // Apply Output Format
      switch (outputFormat) {
        case "singleLine":
          setFormattedOutput(lines.join(" "));
          break;
        case "multiLine":
          setFormattedOutput(lines.join("\n"));
          break;
        case "commaSeparatedSingleLine":
          setFormattedOutput(lines.join(","));
          break;
        case "commaSeparatedSingleLineWithSpace":
          setFormattedOutput(lines.join(", "));
          break;
        case "commaSeparatedMultiLine":
          setFormattedOutput(lines.join(",\n"));
          break;
        case "tabSeparatedSingleLine":
          setFormattedOutput(lines.join("\t"));
          break;
        default:
          setFormattedOutput(listInput);
          break;
      }
    };

    formatOutput();
  }, [listInput, outputFormat, findReplaceRules, encloseRules]);

  return (
    <>
      <div className="p-4">
        {/* Header */}
        <ListMinus />
        <h1>Edit and Transform Lists</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-8 p-4">
        {/* Input and Output Section */}
        <div className="flex flex-wrap gap-1.5">
          <Label htmlFor="input-list">Original list</Label>
          <Textarea
            id="input-list"
            rows="15"
            value={listInput}
            onChange={(e) => setListInput(e.target.value)}
            placeholder="Enter your list here..."
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  id="paste-btn"
                  className="md:ml-auto"
                  variant="outline"
                  size="icon"
                  onClick={handlePaste}
                >
                  <ClipboardPenLine />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Paste</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Label htmlFor="output-list">Transformed list</Label>
          <Textarea
            id="output-list"
            rows="15"
            value={formattedOutput}
            readOnly
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  id="copy-btn"
                  className="md:mr-auto"
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                >
                  <Copy />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Output Format Section */}
      <div className="flex flex-col w-full md:col-span-2 gap-1.5 items-center">
        <h4 className="text-sm">Output format</h4>
        <Select
          value={outputFormat}
          onValueChange={(value) => setOutputFormat(value)}
        >
          <SelectTrigger className="w-full md:w-80">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="singleLine">Single-line</SelectItem>
            <SelectItem value="multiLine">Multi-line</SelectItem>
            <SelectItem value="commaSeparatedSingleLine">
              Single-line (Comma separated)
            </SelectItem>
            <SelectItem value="commaSeparatedSingleLineWithSpace">
              Single-line (Comma separated with space)
            </SelectItem>
            <SelectItem value="commaSeparatedMultiLine">
              Multi-line (Comma separated)
            </SelectItem>
            <SelectItem value="tabSeparatedSingleLine">
              Single-line (Tab separated)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
        {/* First Grid Column */}
        <div className="gap-4">
          <h4 className="pb-4 text-sm">Find & Replace Rules</h4>
          {findReplaceRules.map((rule, index) => (
            <div
              key={rule.id}
              className="flex flex-wrap md:flex-row-1 gap-1.5 py-1"
            >
              <Input
                type="text"
                placeholder="Find..."
                className="w-full md:w-80"
                value={rule.find}
                onChange={(e) =>
                  setFindReplaceRules(
                    findReplaceRules.map((r, i) =>
                      i === index ? { ...r, find: e.target.value } : r
                    )
                  )
                }
              />
              <Select
                value={rule.replaceOption}
                onValueChange={(value) =>
                  setFindReplaceRules(
                    findReplaceRules.map((r, i) =>
                      i === index ? { ...r, replaceOption: value } : r
                    )
                  )
                }
              >
                <SelectTrigger className="w-full md:w-52">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REMOVE">Remove</SelectItem>
                  <SelectItem value='"'>" Double Quote</SelectItem>
                  <SelectItem value="'">' Single Quote</SelectItem>
                  <SelectItem value=":">: Colon</SelectItem>
                  <SelectItem value=";">; Semi-colon</SelectItem>
                  <SelectItem value="-">- Dash</SelectItem>
                  <SelectItem value=" ">Space</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              {/* Show custom input field if "custom" is selected */}
              {rule.replaceOption === "custom" && (
                <Input
                  type="text"
                  placeholder="Custom Replace..."
                  className="w-full md:w-52"
                  value={rule.customReplace}
                  onChange={(e) =>
                    setFindReplaceRules(
                      findReplaceRules.map((r, i) =>
                        i === index
                          ? { ...r, customReplace: e.target.value }
                          : r
                      )
                    )
                  }
                />
              )}
              <Button
                variant="default"
                size="icon"
                onClick={() =>
                  setFindReplaceRules(
                    findReplaceRules.filter((_, i) => i !== index)
                  )
                }
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          <Button variant="default" size="icon" onClick={addFindReplaceRule}>
            <Plus />
          </Button>
        </div>

        {/* Second Grid Column */}
        <div className="gap-4">
          <h4 className="pb-4 text-sm">Enclose Rules</h4>
          {encloseRules.map((rule, index) => (
            <div
              key={rule.id}
              className="flex flex-wrap md:flex-row-1 gap-1.5 py-2"
            >
              <Select
                value={rule.option}
                onValueChange={(value) =>
                  setEncloseRules(
                    encloseRules.map((r, i) =>
                      i === index ? { ...r, option: value } : r
                    )
                  )
                }
              >
                <SelectTrigger className="w-full md:w-52">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='"'>" Double Quote</SelectItem>
                  <SelectItem value="'">' Single Quote</SelectItem>
                  <SelectItem value=":">: Colon</SelectItem>
                  <SelectItem value=";">; Semi-colon</SelectItem>
                  <SelectItem value="-">- Dash</SelectItem>
                  <SelectItem value=" ">Space</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              {/* Show custom input field if "custom" is selected */}
              {rule.option === "custom" && (
                <Input
                  type="text"
                  placeholder="Custom Enclose..."
                  className="w-full md:w-52"
                  value={rule.customValue}
                  onChange={(e) =>
                    setEncloseRules(
                      encloseRules.map((r, i) =>
                        i === index ? { ...r, customValue: e.target.value } : r
                      )
                    )
                  }
                />
              )}
              <RadioGroup
                value={rule.scope}
                onValueChange={(value) =>
                  setEncloseRules(
                    encloseRules.map((r, i) =>
                      i === index ? { ...r, scope: value } : r
                    )
                  )
                }
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="list-item" id={`list-item-${index}`} />
                  <Label htmlFor={`list-item-${index}`}>List Item</Label>
                  <RadioGroupItem value="prefix" id={`prefix-${index}`} />
                  <Label htmlFor={`prefix-${index}`}>Prefix</Label>
                  <RadioGroupItem value="suffix" id={`suffix-${index}`} />
                  <Label htmlFor={`suffix-${index}`}>Suffix</Label>
                  <RadioGroupItem value="list" id={`list-${index}`} />
                  <Label htmlFor={`list-${index}`}>List</Label>
                </div>
              </RadioGroup>
              <Button
                variant="default"
                size="icon"
                onClick={() =>
                  setEncloseRules(encloseRules.filter((_, i) => i !== index))
                }
              >
                <Trash2 />
              </Button>
            </div>
          ))}

          <Button variant="default" size="icon" onClick={addEncloseRule}>
            <Plus />
          </Button>
        </div>
      </div>
    </>
  );
};

export default TransformList;
