import React, { useState, useEffect } from "react";
import {
  ListMinus,
  Plus,
  Trash2,
  Copy,
  ClipboardPenLine,
  ListStart,
  TableRowsSplit,
  TableColumnsSplit,
  Space,
  ArrowRightToLine,
  Terminal,
  Columns2,
  Rows2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Parentheses,
  Brackets,
  Braces,
  Square,
  SquareStack,
  SquareArrowOutDownRight,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  formatList,
  handleLayoutChange,
  handleDelimiterChange,
  FindReplaceRule,
  EncloseRule,
} from "@/lib/listTransformUtils";
import { useToast } from "@/hooks/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TransformList: React.FC = () => {
  const [layout, setLayout] = useState("row");
  const [listInput, setListInput] = useState("");
  const [findReplaceRules, setFindReplaceRules] = useState([
    { findString: "", replaceOption: "", customReplaceString: "" },
  ]);
  const [selectedDelimiters, setSelectedDelimiters] = useState<string[]>([]);
  const [encloseRules, setEncloseRules] = useState([
    { encloseOption: "", customEncloseString: "", encloseAll: false },
  ]);

  const [formattedOutput, setFormattedOutput] = useState("");
  const [outputFormat, setOutputFormat] = useState("multiLine");

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

  const handleDelimiterChange = (value: string[]) => {
    setSelectedDelimiters(value); // Update the state directly with the new toggle values
  };

  // Handler to switch layout
  const handleLayoutChange = (value: string | null) => {
    if (value) setLayout(value); // Update layout state
  };

  // Dynamically update formattedOutput based on listInput and outputFormat
  useEffect(() => {
    const formatOutput = () => {
      if (!listInput) {
        setFormattedOutput("");
        return;
      }

      // Split the input into lines or items
      const isMultiLine = listInput.includes("\n");
      let lines = isMultiLine
        ? listInput.split("\n").map((item) => item.trim())
        : listInput.split(/[\s,]+/).filter((item) => item.trim());

      // Apply Find/Replace Logic
      findReplaceRules.forEach(
        ({ findString, replaceOption, customReplaceString }) => {
          if (findString && replaceOption) {
            const findRegex = new RegExp(findString, "g");

            if (replaceOption === "remove") {
              lines = lines.map((line) => line.replace(findRegex, ""));
            } else {
              const replaceWith =
                replaceOption === "custom"
                  ? customReplaceString
                  : replaceOption;
              lines = lines.map((line) =>
                line.replace(findRegex, replaceWith || "")
              );
            }
          }
        }
      );

      // Apply Enclose Logic
      encloseRules.forEach(
        ({ encloseOption, customEncloseString, encloseAll }) => {
          const applyEnclose = (content: string) => {
            let openBracket = "";
            let closeBracket = "";

            if (encloseOption === "custom") {
              openBracket = customEncloseString;
              closeBracket = customEncloseString;
            } else {
              openBracket = encloseOption.startsWith("(")
                ? "("
                : encloseOption.startsWith("{")
                ? "{"
                : encloseOption.startsWith("[")
                ? "["
                : encloseOption;
              closeBracket = encloseOption.startsWith("(")
                ? ")"
                : encloseOption.startsWith("{")
                ? "}"
                : encloseOption.startsWith("[")
                ? "]"
                : encloseOption;
            }

            return `${openBracket}${content}${closeBracket}`;
          };

          if (encloseAll) {
            // Enclose the entire list with respect to delimiters and orientation
            const joined = lines.join(
              selectedDelimiters.length > 0
                ? selectedDelimiters
                    .map(
                      (key) =>
                        ({
                          commaSeparated: ",",
                          spaceSeparated: " ",
                          tabSeparated: "\t",
                        }[key])
                    )
                    .join("")
                : ""
            );
            lines = [
              applyEnclose(
                outputFormat === "singleLine" ? joined : lines.join("\n")
              ),
            ];
          } else {
            // Enclose each item individually
            lines = lines.map((line) => applyEnclose(line));
          }
        }
      );

      // Apply Delimiters Without Forcing a Single Line
      if (selectedDelimiters.length > 0) {
        const delimiterMap: Record<string, string> = {
          commaSeparated: ",",
          spaceSeparated: " ",
          tabSeparated: "\t",
        };

        const combinedDelimiter = selectedDelimiters
          .map((key) => delimiterMap[key])
          .join("");

        if (outputFormat === "singleLine") {
          lines = [lines.join(combinedDelimiter)];
        } else if (outputFormat === "multiLine") {
          lines = lines.map((line, index) =>
            index < lines.length - 1 ? `${line}${combinedDelimiter}` : line
          );
        }
      }

      // Apply Output Format
      setFormattedOutput(
        outputFormat === "singleLine" ? lines.join("") : lines.join("\n")
      );
    };

    formatOutput();
  }, [
    listInput,
    findReplaceRules,
    selectedDelimiters,
    outputFormat,
    encloseRules,
  ]);

  return (
    <>
      {/* Header */}
      <div className="flex p-4 gap-2 items-center justify-center">
        <ListMinus size="30" />
        <h1>Edit and Transform Lists</h1>
      </div>

      {/* Content */}
      
      <div className="flex gap-4 p-4">
        {/* Column 1 */}
        <div className="flex flex-col gap-4 w-1/4">
          {/* Row 1 in Column 1 */}
          <div className="flex flex-row gap-4 border rounded-lg justify-between">
            <Card className="border-0">
              <CardHeader>
                <CardTitle className="text-sm">Layout</CardTitle>
              </CardHeader>
              <CardContent className="flex">
                <ToggleGroup
                  variant="outline"
                  type="single"
                  value={layout}
                  onValueChange={handleLayoutChange}
                >
                  <ToggleGroupItem value="row" aria-label="Row View">
                    <Rows2 />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="col" aria-label="Column View">
                    <Columns2 />
                  </ToggleGroupItem>
                </ToggleGroup>
              </CardContent>
            </Card>
            <Card className="border-0">
              <CardHeader>
                <CardTitle className="text-sm">Transpose</CardTitle>
              </CardHeader>
              <CardContent className="flex">
                <ToggleGroup
                  variant="outline"
                  type="single"
                  value={outputFormat}
                  onValueChange={(value) =>
                    setOutputFormat(value || "singleLine")
                  }
                >
                  <ToggleGroupItem value="multiLine">
                    <TableColumnsSplit />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="singleLine">
                    <TableRowsSplit />
                  </ToggleGroupItem>
                </ToggleGroup>
              </CardContent>
            </Card>
            <Card className="border-0">
              <CardHeader>
                <CardTitle className="text-sm">Delimiter</CardTitle>
              </CardHeader>
              <CardContent className="flex">
                <ToggleGroup
                  variant="outline"
                  type="multiple"
                  value={selectedDelimiters}
                  onValueChange={(value) => handleDelimiterChange(value)}
                >
                  <ToggleGroupItem
                    value="commaSeparated"
                    aria-label="Comma Seperated"
                  >
                    ,
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="spaceSeparated"
                    aria-label="Space Seperated"
                  >
                    <Space />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="tabSeparated"
                    aria-label="Tab Seperated"
                  >
                    <ArrowRightToLine />
                  </ToggleGroupItem>
                </ToggleGroup>
              </CardContent>
            </Card>
          </div>

          {findReplaceRules.map((rule, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-sm">Find</CardTitle>
              </CardHeader>
              <CardContent className="flex">
                <Input
                  type="text"
                  placeholder="Find..."
                  value={rule.findString}
                  onChange={(e) => {
                    const updatedRules = [...findReplaceRules];
                    updatedRules[index].findString = e.target.value;
                    setFindReplaceRules(updatedRules);
                  }}
                />
              </CardContent>
              <CardHeader>
                <CardTitle className="text-sm">Replace</CardTitle>
              </CardHeader>
              <CardContent className="flex">
                <ToggleGroup
                  variant="outline"
                  type="single"
                  value={rule.replaceOption}
                  onValueChange={(value) => {
                    const updatedRules = [...findReplaceRules];
                    updatedRules[index].replaceOption = value || "";
                    setFindReplaceRules(updatedRules);
                  }}
                >
                  <ToggleGroupItem value="remove">
                    <X />
                  </ToggleGroupItem>
                  <ToggleGroupItem value=" ">
                    <Space />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="custom">
                    <Terminal />
                  </ToggleGroupItem>
                </ToggleGroup>
              </CardContent>
              {rule.replaceOption === "custom" && (
                <CardContent className="flex">
                  <Input
                    type="text"
                    placeholder="Custom string..."
                    value={rule.customReplaceString}
                    onChange={(e) => {
                      const updatedRules = [...findReplaceRules];
                      updatedRules[index].customReplaceString = e.target.value;
                      setFindReplaceRules(updatedRules);
                    }}
                  />
                </CardContent>
              )}
              <CardContent className="flex space-x-2 justify-end">
                <Button
                  variant="default"
                  type="icon"
                  onClick={() =>
                    setFindReplaceRules([
                      ...findReplaceRules,
                      {
                        findString: "",
                        replaceOption: "",
                        customReplaceString: "",
                      },
                    ])
                  }
                >
                  <Plus />
                </Button>
                <Button
                  variant="outline"
                  type="icon"
                  disabled={findReplaceRules.length === 1}
                  onClick={() => {
                    const updatedRules = findReplaceRules.filter(
                      (_, i) => i !== index
                    );
                    setFindReplaceRules(updatedRules);
                  }}
                >
                  <Trash2 />
                </Button>
              </CardContent>
            </Card>
          ))}

          {encloseRules.map((rule, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-sm">Enclose</CardTitle>
              </CardHeader>
              <CardContent className="flex">
                <ToggleGroup
                  variant="outline"
                  type="single"
                  value={rule.encloseAll ? "list" : "item"}
                  onValueChange={(value) => {
                    const updatedRules = [...encloseRules];
                    updatedRules[index].encloseAll = value === "list";
                    setEncloseRules(updatedRules);
                  }}
                >
                  <ToggleGroupItem value="item" aria-label="Enclose Each Item">
                    <Square />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="list"
                    aria-label="Enclose Entire List"
                  >
                    <SquareStack />
                  </ToggleGroupItem>
                </ToggleGroup>
              </CardContent>
              <CardContent className="flex">
                <ToggleGroup
                  variant="outline"
                  type="single"
                  value={rule.encloseOption}
                  onValueChange={(value) => {
                    const updatedRules = [...encloseRules];
                    updatedRules[index].encloseOption = value || "";
                    setEncloseRules(updatedRules);
                  }}
                >
                  <ToggleGroupItem value='"'>"</ToggleGroupItem>
                  <ToggleGroupItem value="'">'</ToggleGroupItem>
                  <ToggleGroupItem value="()">
                    <Parentheses />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="{}">
                    <Braces />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="[]">
                    <Brackets />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="custom">
                    <Terminal />
                  </ToggleGroupItem>
                </ToggleGroup>
              </CardContent>
              {rule.encloseOption === "custom" && (
                <CardContent className="flex">
                  <Input
                    type="text"
                    placeholder="Custom string..."
                    value={rule.customEncloseString}
                    onChange={(e) => {
                      const updatedRules = [...encloseRules];
                      updatedRules[index].customEncloseString =
                        e.target.value.trim() || '""';
                      setEncloseRules(updatedRules);
                    }}
                  />
                </CardContent>
              )}
              <CardContent className="flex space-x-2 justify-end">
                <Button
                  variant="default"
                  type="icon"
                  onClick={() =>
                    setEncloseRules([
                      ...encloseRules,
                      {
                        encloseOption: "",
                        customEncloseString: "",
                        encloseAll: false,
                      },
                    ])
                  }
                >
                  <Plus />
                </Button>
                <Button
                  variant="outline"
                  type="icon"
                  disabled={encloseRules.length === 1}
                  onClick={() => {
                    const updatedRules = encloseRules.filter(
                      (_, i) => i !== index
                    );
                    setEncloseRules(updatedRules);
                  }}
                >
                  <Trash2 />
                </Button>
              </CardContent>
            </Card>
          ))}
          <div className="flex gap-4 justify-center">
        <Popover>
          <PopoverTrigger variant="outline" asChild>
            <Button variant="outline">
              <SquareArrowOutDownRight /> Legend
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full">
            <div className="grid gap-10 text-sm">
              <div className="space-y-2">
                <h4 className="text-sm leading-none">Layout</h4>
                <p className="text-sm text-muted-foreground">
                  Control the screen layout
                </p>
                <div className="flex gap-2 items-center">
                  <Button id="btn-rows" variant="outline" type="icon">
                    <Rows2 />
                  </Button>
                  Rows
                  <Button id="btn-rows" variant="outline" type="icon">
                    <Columns2 />
                  </Button>
                  Columns
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm leading-none">Format</h4>
                <p className="text-sm text-muted-foreground">
                  Transpose the output
                </p>
                <div className="flex gap-2 items-center">
                  <Button id="btn-rows" variant="outline" type="icon">
                  <TableColumnsSplit />
                  </Button>
                  Multi-line
                  <Button id="btn-rows" variant="outline" type="icon">
                  <TableRowsSplit />
                  </Button>
                  Single-line
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm leading-none">Delimiter</h4>
                <p className="text-sm text-muted-foreground">
                  Control the list view box layout
                </p>
                <div className="flex gap-2 items-center">
                  <Button id="btn-rows" variant="outline" type="icon">
                  ,
                  </Button>
                  Comma
                  <Button id="btn-rows" variant="outline" type="icon">
                  <Space />
                  </Button>
                  Space
                  <Button id="btn-rows" variant="outline" type="icon">
                  <ArrowRightToLine />
                  </Button>
                  Tab
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm leading-none">Find and replace</h4>
                <p className="text-sm text-muted-foreground">
                  Find a replace controls
                </p>
                <div className="flex gap-2 items-center">
                  <Button id="btn-rows" variant="outline" type="icon">
                  <X />
                  </Button>
                  Remove
                  <Button id="btn-rows" variant="outline" type="icon">
                  <Space />
                  </Button>
                  Space
                  <Button id="btn-rows" variant="outline" type="icon">
                  <Terminal />
                  </Button>
                  Custom
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm leading-none">Enclose</h4>
                <p className="text-sm text-muted-foreground">
                  Control item or list encapsulation
                </p>
                <div className="flex gap-2 items-center">
                  <Button id="btn-rows" variant="outline" type="icon">
                  <Square />
                  </Button>
                  Each item
                  <Button id="btn-rows" variant="outline" type="icon">
                  <SquareStack />
                  </Button>
                  Whole list
                </div>
                <div className="flex gap-2 items-center">
                  <Button id="btn-rows" variant="outline" type="icon">
                  "
                  </Button>
                  Quotes
                  <Button id="btn-rows" variant="outline" type="icon">
                  '
                  </Button>
                  Quote
                  <Button id="btn-rows" variant="outline" type="icon">
                  <Parentheses />
                  </Button>
                  Parentheses
                  
                  <Button id="btn-rows" variant="outline" type="icon">
                  <Braces />
                  </Button>
                  Braces
                  <Button id="btn-rows" variant="outline" type="icon">
                  <Brackets />
                  </Button>
                  Brackets
                  <Button id="btn-rows" variant="outline" type="icon">
                  <Terminal />
                  </Button>
                  Custom
                </div>
              </div>              


            </div>
          </PopoverContent>
        </Popover>
      </div>
        </div>

        {/* Column 2 */}

        {layout === "row" && (
          <div className="flex flex-col gap-4 w-full">
            <div className="flex text-start space-y-4 px-4 h-full">
              <Textarea
                id="input-list"
                className="p-4"
                value={listInput}
                onChange={(e) => setListInput(e.target.value)}
                placeholder="Enter your list here..."
              />
            </div>
            <div className="flex justify-center gap-4">
              <div className="flex">
                <Button id="paste-btn" variant="outline" onClick={handlePaste}>
                  <ChevronUp /> <ClipboardPenLine />
                </Button>
              </div>
              <div className="flex items-center">
                <ListStart className="rotate-180" />
              </div>
              <div className="flex">
                <Button id="copy-btn" variant="outline" onClick={handleCopy}>
                  <Copy /> <ChevronDown />
                </Button>
              </div>
            </div>
            <div className="flex text-start space-y-4 px-4 h-full">
              <Textarea
                id="output-list"
                className="p-4"
                value={formattedOutput}
                readOnly
              />
            </div>
          </div>
        )}

        {layout === "col" && (
          <div className="flex flex-row gap-4 w-full">
            <div className="flex text-start space-y-4 px-4 w-full">
              <Textarea
                id="input-list"
                className="p-4"
                value={listInput}
                onChange={(e) => setListInput(e.target.value)}
                placeholder="Enter your list here..."
              />
            </div>
            {/* Row 3 in Column 2 */}
            <div className="flex items-center">
              <div className="flex flex-col items-center gap-4">
                <div className="flex">
                  <Button
                    id="paste-btn"
                    variant="outline"
                    onClick={handlePaste}
                  >
                    <ChevronLeft /> <ClipboardPenLine />
                  </Button>
                </div>
                <div className="flex">
                  <ListStart className="rotate-180" />
                </div>
                <div className="flex">
                  <Button id="copy-btn" variant="outline" onClick={handleCopy}>
                    <Copy /> <ChevronRight />
                  </Button>
                </div>
              </div>
            </div>
            {/* Row 4 in Column 2 */}
            <div className="flex text-start space-y-4 px-4 w-full">
              <Textarea
                id="output-list"
                className="p-4"
                value={formattedOutput}
                readOnly
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TransformList;
